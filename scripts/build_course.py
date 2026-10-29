#!/usr/bin/env python3
"""Builds the offline "AI Literacy for Everyone" course packages from Google Drive.

Reads course/settings.json and works through the packages listed there. Each
stage is its own command, so they can be run and checked one at a time:

    python -I scripts/build_course.py export [--package ID ...] [--out build/course]
    python -I scripts/build_course.py compress [--package ID ...] [--out build/course]

export   Exports the 4 Google masters of each package's Resources folder:
         PDF for the offline package; DOCX/PPTX and PDF for the website.
         Writes build/course/exports/<key>/ with a manifest.json, where <key> is
         the package id, or the parent folder's code for packages that share a
         Resources folder (the two Swahili versions share "sw").
compress Shrinks the pictures in the exported PDFs for the package and writes
         build/course/pdfs/<key>/. Each JPEG is resized to PDF_DPI pixels per
         inch of the largest size it is shown at and saved at PDF_QUALITY, in
         place, so everything that refers to it keeps working. (PyMuPDF's own
         rewrite_images breaks the pattern-filled pictures in Google's slide
         exports.) It stops if a page count changes, MuPDF reports a problem
         drawing the new file, or any page looks noticeably different.

Drive is read without credentials, through the link-shared course folder, with
the helpers in check_course.py. Downloaded files are only checked in memory
(file signature, PDF page count) and written to the output folder; nothing
downloaded is executed.
"""

import argparse
import concurrent.futures as cf
import io
import json
import math
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import check_course as drive  # noqa: E402

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SETTINGS = os.path.join(REPO, "course", "settings.json")

# Export formats per master type: (format name, URL suffix, file signature).
EXPORTS = {
    drive.DOC: [
        ("pdf", "export?format=pdf", b"%PDF"),
        ("docx", "export?format=docx", b"PK"),
    ],
    drive.SLIDES: [
        ("pdf", "export/pdf", b"%PDF"),
        ("pptx", "export/pptx", b"PK"),
    ],
}
EXPORT_BASE = {
    drive.DOC: "https://docs.google.com/document/d/{id}/",
    drive.SLIDES: "https://docs.google.com/presentation/d/{id}/",
}
UNSAFE = re.compile(r'[<>:"/\\|?*\x00-\x1f]')

# Picture settings for the package PDFs: 200 pixels per inch of the size a picture is
# shown at matches a 1080p projector showing it full width; quality 80 keeps text in
# screenshots sharp. Halves the slides (15 MB -> 7.4 MB).
PDF_DPI = 200
PDF_QUALITY = 80
PDF_UNKNOWN_SIZE = 1600  # longest side, for a picture whose shown size MuPDF can't tell
PDF_MAX_PAGE_DIFF = 6  # mean difference per pixel (0-255) of a page drawn at 40 dpi


class BuildError(Exception):
    pass


def load_settings():
    with open(SETTINGS, encoding="utf-8") as f:
        return json.load(f)


def by_code(parent, code):
    """The one subfolder of `parent` whose name starts with `code` ("en — English" is "en")."""
    found = [e for e in drive.list_folder(parent.id, parent.path)
             if e.is_folder and e.name.split() and e.name.split()[0] == code]
    if len(found) != 1:
        raise BuildError(f'{parent.path or "course folder"}: expected one folder "{code} …", found {len(found)}')
    return found[0]


def resources_key(package):
    """The name of a package's folder under exports/ and pdfs/: its id, or the parent
    folder's code when it shares a Resources folder ("sw" for both Swahili versions)."""
    return "/".join(package["folder"][:-1]) if package.get("sharedResources") else package["id"]


def resources_folder(settings, package):
    """(key, folder) of a package's Resources: the folder in it (or next to it, if
    sharedResources) that holds the Google Docs and Slides masters."""
    node = parent = drive.Entry(settings["drive"]["root"], "course folder", drive.FOLDER, "")
    for code in package["folder"]:
        parent, node = node, by_code(node, code)
    home = parent if package.get("sharedResources") else node
    candidates = [e for e in drive.list_folder(home.id, home.path) if e.is_folder and any(
        k.mime in (drive.DOC, drive.SLIDES) for k in drive.list_folder(e.id, e.path))]
    if len(candidates) != 1:
        raise BuildError(f"{home.path}: expected one Resources folder, found {len(candidates)}")
    return resources_key(package), candidates[0]


def masters(folder):
    """The 4 masters of a Resources folder as {number: entry}, checked against check_course.RESOURCES."""
    found = {}
    for e in drive.list_folder(folder.id, folder.path):
        m = drive.NUMBERED.match(e.name)
        if m and not e.is_folder and int(m.group(1)) in drive.RESOURCES:
            if int(m.group(1)) in found:
                raise BuildError(f'{folder.path}: two files numbered {m.group(1)}')
            found[int(m.group(1))] = e
    for n, (role, mime, _pages) in drive.RESOURCES.items():
        if n not in found:
            raise BuildError(f'{folder.path}: missing "{n} - …" ({role})')
        if found[n].mime != mime:
            raise BuildError(f"{found[n].path}: {role} is {found[n].mime}, expected {mime}")
    return found


def export_one(entry, fmt, suffix, signature, out_dir):
    """Download one export, check it, write it; return its manifest record."""
    data = drive.fetch(EXPORT_BASE[entry.mime].format(id=entry.id) + suffix)
    if not data.startswith(signature):
        raise BuildError(f"{entry.path}: {fmt} export is not a {fmt} file (starts {data[:20]!r})")
    name = UNSAFE.sub("_", entry.name).strip() + "." + fmt
    with open(os.path.join(out_dir, name), "wb") as f:
        f.write(data)
    record = {"file": name, "bytes": len(data)}
    if fmt == "pdf":
        record["pages"] = drive.pdf_page_count(data)
    return fmt, record


def cmd_export(settings, packages, out):
    folders = {}
    for p in packages:
        key, folder = resources_folder(settings, p)
        folders.setdefault(key, (folder, []))[1].append(p["id"])

    problems = []
    for key, (folder, ids) in folders.items():
        out_dir = os.path.join(out, "exports", key)
        os.makedirs(out_dir, exist_ok=True)
        found = masters(folder)
        jobs = []
        with cf.ThreadPoolExecutor(4) as ex:
            for n, e in sorted(found.items()):
                for fmt, suffix, signature in EXPORTS[e.mime]:
                    jobs.append((n, ex.submit(export_one, e, fmt, suffix, signature, out_dir)))
            records = {}
            for n, fut in jobs:
                fmt, record = fut.result()
                records.setdefault(n, {})[fmt] = record

        manifest = {"packages": ids, "folder": folder.path, "masters": []}
        for n, e in sorted(found.items()):
            role, _mime, pages = drive.RESOURCES[n]
            got = records[n]["pdf"]["pages"]
            if pages and got != pages:
                problems.append(f"{key}: {role} PDF has {got} pages, expected {pages}")
            manifest["masters"].append({"number": n, "role": role, "title": e.name, "id": e.id, "files": records[n]})
        with open(os.path.join(out_dir, "manifest.json"), "w", encoding="utf-8", newline="\n") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)
            f.write("\n")

        summary = ", ".join(f'{m["number"]}: {m["files"]["pdf"]["pages"]} p' for m in manifest["masters"])
        size = sum(r["bytes"] for m in manifest["masters"] for r in m["files"].values())
        print(f"{key:6} {'/'.join(ids):12} {len(jobs)} files, {size / 1e6:.1f} MB  (PDF pages {summary})")

    for p in problems:
        print("ERROR", p)
    return 1 if problems else 0


def shrink_pdf(src, dst):
    """Shrink the JPEGs in a PDF in place (see compress in the module notes); return
    (pictures, pictures shrunk)."""
    import pymupdf
    from PIL import Image

    doc = pymupdf.open(src)
    shown = {}  # xref -> largest side it is shown at, in inches
    for page in doc:
        for im in page.get_images(full=True):
            for r in page.get_image_rects(im[0]):
                shown[im[0]] = max(shown.get(im[0], 0), max(r.width, r.height) / 72)
    seen, shrunk = set(), 0
    for page in doc:
        for im in page.get_images(full=True):
            xref = im[0]
            if xref in seen or doc.xref_get_key(xref, "Filter")[1] != "/DCTDecode":
                seen.add(xref)
                continue
            seen.add(xref)
            raw = doc.xref_stream_raw(xref)
            img = Image.open(io.BytesIO(raw))
            img.load()
            target = math.ceil(shown[xref] * PDF_DPI) if xref in shown else PDF_UNKNOWN_SIZE
            scale = min(1.0, target / max(img.size))
            size = (max(1, round(img.width * scale)), max(1, round(img.height * scale)))
            buf = io.BytesIO()
            (img.resize(size, Image.LANCZOS) if scale < 1 else img).save(buf, "JPEG", quality=PDF_QUALITY, optimize=True)
            if len(buf.getvalue()) >= len(raw):
                continue
            doc.update_stream(xref, buf.getvalue(), compress=False)
            doc.xref_set_key(xref, "Filter", "/DCTDecode")
            doc.xref_set_key(xref, "DecodeParms", "null")
            doc.xref_set_key(xref, "Width", str(size[0]))
            doc.xref_set_key(xref, "Height", str(size[1]))
            shrunk += 1
    doc.save(dst, garbage=3, deflate=True)
    return len(seen), shrunk


def check_shrunk(src, dst):
    """Problems with a shrunk PDF compared with its original: page count, MuPDF
    drawing problems, or pages that look noticeably different."""
    import pymupdf

    pymupdf.TOOLS.mupdf_display_errors(False)
    a, b = pymupdf.open(src), pymupdf.open(dst)
    if len(a) != len(b):
        return [f"{len(b)} pages instead of {len(a)}"]
    pymupdf.TOOLS.reset_mupdf_warnings()
    worst = 0.0
    for pa, pb in zip(a, b):
        sa, sb = pa.get_pixmap(dpi=40).samples, pb.get_pixmap(dpi=40).samples
        worst = max(worst, sum(abs(x - y) for x, y in zip(sa, sb)) / len(sa))
    problems = []
    warnings = pymupdf.TOOLS.mupdf_warnings()
    if warnings:
        problems.append("MuPDF: " + warnings.splitlines()[0])
    if worst > PDF_MAX_PAGE_DIFF:
        problems.append(f"a page changed too much ({worst:.1f} > {PDF_MAX_PAGE_DIFF})")
    return problems


def cmd_compress(packages, out):
    keys = []
    for p in packages:
        if resources_key(p) not in keys:
            keys.append(resources_key(p))
    problems = []
    for key in keys:
        src_dir, dst_dir = os.path.join(out, "exports", key), os.path.join(out, "pdfs", key)
        if not os.path.isfile(os.path.join(src_dir, "manifest.json")):
            raise BuildError(f"{src_dir}: no export yet; run the export command first")
        os.makedirs(dst_dir, exist_ok=True)
        with open(os.path.join(src_dir, "manifest.json"), encoding="utf-8") as f:
            pdfs = [m["files"]["pdf"]["file"] for m in json.load(f)["masters"]]
        before = after = 0
        for name in pdfs:
            src, dst = os.path.join(src_dir, name), os.path.join(dst_dir, name)
            shrink_pdf(src, dst)
            if os.path.getsize(dst) >= os.path.getsize(src):
                with open(src, "rb") as fi, open(dst, "wb") as fo:  # nothing to gain: keep the export
                    fo.write(fi.read())
            else:
                problems += [f"{key}/{name}: {p}" for p in check_shrunk(src, dst)]
            before += os.path.getsize(src)
            after += os.path.getsize(dst)
        print(f"{key:6} {len(pdfs)} PDFs  {before / 1e6:.1f} MB -> {after / 1e6:.1f} MB")
    for p in problems:
        print("ERROR", p)
    return 1 if problems else 0


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("command", choices=["export", "compress"])
    ap.add_argument("--package", action="append", help="only this package id (repeatable)")
    ap.add_argument("--out", default=os.path.join(REPO, "build", "course"), help="output folder")
    args = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

    settings = load_settings()
    packages = settings["packages"]
    if args.package:
        unknown = set(args.package) - {p["id"] for p in packages}
        if unknown:
            ap.error("unknown package: " + ", ".join(sorted(unknown)))
        packages = [p for p in packages if p["id"] in args.package]
    try:
        if args.command == "compress":
            return cmd_compress(packages, args.out)
        return cmd_export(settings, packages, args.out)
    except BuildError as e:
        print("ERROR", e)
        return 1


if __name__ == "__main__":
    sys.exit(main())

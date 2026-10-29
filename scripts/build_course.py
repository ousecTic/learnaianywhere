#!/usr/bin/env python3
"""Builds the offline "AI Literacy for Everyone" course packages from Google Drive.

Reads course/settings.json and works through the packages listed there. Each
stage is its own command, so they can be run and checked one at a time:

    python -I scripts/build_course.py export [--package ID ...] [--out build/course]
    python -I scripts/build_course.py compress [--package ID ...] [--out build/course]
    python -I scripts/build_course.py download [--package ID ...] [--out build/course]

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
download Downloads each package's videos and their captions into
         build/course/media/<package id>/<section>/ (section 0 is the
         Introduction, 1-4 the lessons), keeping Drive's "N - Title" names, with a
         manifest.json. Copies are kept between runs: a file is downloaded again
         only if it is new or its size in Drive changed. It stops if the folders
         don't have the expected layout, a video has no caption, or a download
         isn't a real MP4/WebVTT file (for example a Google limit page).

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
import time
import urllib.request

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


def package_folder(settings, package):
    """(parent, folder) of a package's Drive folder, found by the codes in its settings."""
    node = parent = drive.Entry(settings["drive"]["root"], "course folder", drive.FOLDER, "")
    for code in package["folder"]:
        parent, node = node, by_code(node, code)
    return parent, node


def resources_folder(settings, package):
    """(key, folder) of a package's Resources: the folder in it (or next to it, if
    sharedResources) that holds the Google Docs and Slides masters."""
    parent, node = package_folder(settings, package)
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


DOWNLOAD_URL = "https://drive.usercontent.google.com/download?id={id}&export=download&confirm=t"


def media_items(settings, package):
    """[(section, number, video entry, caption entry)] for a package, read from Drive
    with check_course's lesson scan; raises BuildError on any layout problem."""
    _parent, folder = package_folder(settings, package)
    rep = drive.Report()
    lessons, _res = drive.classify_version_folder(
        package["id"], drive.list_folder(folder.id, folder.path), rep, folder.path,
        not package.get("sharedResources"))
    items = []
    for section, lesson in sorted(lessons.items()):
        scan = drive.scan_lesson(package["id"], lesson, rep)
        for num, videos in sorted(scan["videos"].items()):
            caps = scan["caps"].get(num)
            if len(videos) > 1:
                rep.error(package["id"], lesson.path, f"two videos numbered {num}")
            if not caps:
                rep.error(package["id"], lesson.path, f"no caption for {videos[0].name!r}")
                continue
            items.append((section, num, videos[0], caps[0]))
    errors = [f"{path}: {msg}" for _v, level, path, msg in rep.items if level == "ERROR"]
    if errors:
        raise BuildError("; ".join(errors))
    return items


def download_file(entry, dst, signature_ok):
    """Stream a Drive file to dst (through dst.part), checking its first bytes."""
    tmp = dst + ".part"
    for attempt in range(4):
        try:
            req = urllib.request.Request(DOWNLOAD_URL.format(id=entry.id), headers=drive.UA)
            with urllib.request.urlopen(req, timeout=300) as r, open(tmp, "wb") as f:
                head = r.read(64)
                if not signature_ok(head):
                    raise BuildError(f"{entry.path}: download is not the expected file (starts {head[:40]!r});"
                                     " Google may be limiting anonymous downloads (see plan step 5.2)")
                f.write(head)
                while True:
                    chunk = r.read(1 << 20)
                    if not chunk:
                        break
                    f.write(chunk)
            os.replace(tmp, dst)
            return os.path.getsize(dst)
        except BuildError:
            raise
        except Exception:  # noqa: BLE001 - network trouble: retry, then give up
            if attempt == 3:
                raise
            time.sleep(5 * (attempt + 1))


def is_mp4(head):
    return head[4:8] == b"ftyp"


def is_vtt(head):
    return head.lstrip(b"\xef\xbb\xbf").startswith(b"WEBVTT")


def cmd_download(settings, packages, out):
    for p in packages:
        pkg_dir = os.path.join(out, "media", p["id"])
        os.makedirs(pkg_dir, exist_ok=True)
        manifest_path = os.path.join(pkg_dir, "manifest.json")
        old = {}
        if os.path.isfile(manifest_path):
            with open(manifest_path, encoding="utf-8") as f:
                old = {r["id"]: r for item in json.load(f)["items"] for r in (item["video"], item["caption"])}

        items = media_items(settings, p)
        jobs = []  # (record, entry, path, check)
        manifest = {"package": p["id"], "items": []}
        for section, num, video, caption in items:
            item = {"section": section, "number": num, "title": video.name[:-4].strip()}
            for kind, entry, check in (("video", video, is_mp4), ("caption", caption, is_vtt)):
                rel = f"{section}/{UNSAFE.sub('_', entry.name).strip()}"
                item[kind] = {"id": entry.id, "file": rel}
                jobs.append((item[kind], entry, os.path.join(pkg_dir, rel), check))
            manifest["items"].append(item)

        def run(job):
            record, entry, path, check = job
            os.makedirs(os.path.dirname(path), exist_ok=True)
            _head, size = drive.probe_head(entry.id, 8)
            prev = old.get(entry.id)
            if prev and prev.get("bytes") == size and prev["file"] == record["file"] and os.path.isfile(path) \
                    and os.path.getsize(path) == size:
                record["bytes"] = size
                return False
            record["bytes"] = download_file(entry, path, check)
            if size is not None and record["bytes"] != size:
                raise BuildError(f"{entry.path}: got {record['bytes']} bytes, Drive says {size}")
            return True

        start = time.time()
        with cf.ThreadPoolExecutor(3) as ex:
            fetched = sum(ex.map(run, jobs))

        # Drop files left from earlier runs that are no longer in Drive (renamed or removed).
        keep = {os.path.normpath(os.path.join(pkg_dir, j[0]["file"])) for j in jobs} | {os.path.normpath(manifest_path)}
        for root, _dirs, files in os.walk(pkg_dir):
            for name in files:
                path = os.path.normpath(os.path.join(root, name))
                if path not in keep:
                    os.remove(path)

        with open(manifest_path, "w", encoding="utf-8", newline="\n") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)
            f.write("\n")
        total = sum(it[k]["bytes"] for it in manifest["items"] for k in ("video", "caption"))
        print(f"{p['id']:6} {len(items)} videos + captions, {total / 1e6:.0f} MB; "
              f"downloaded {fetched}, kept {len(jobs) - fetched} ({time.time() - start:.0f} s)")
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("command", choices=["export", "compress", "download"])
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
        if args.command == "download":
            return cmd_download(settings, packages, args.out)
        return cmd_export(settings, packages, args.out)
    except BuildError as e:
        print("ERROR", e)
        return 1


if __name__ == "__main__":
    sys.exit(main())

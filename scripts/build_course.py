#!/usr/bin/env python3
"""Builds the offline "AI Literacy for Everyone" course packages from Google Drive.

Reads course/settings.json and works through the packages listed there. Each
stage is its own command, so they can be run and checked one at a time:

    python -I scripts/build_course.py export [--package ID ...] [--out build/course]

export   Exports the 4 Google masters of each package's Resources folder:
         PDF for the offline package; DOCX/PPTX and PDF for the website.
         Writes build/course/exports/<key>/ with a manifest.json, where <key> is
         the package id, or the parent folder's code for packages that share a
         Resources folder (the two Swahili versions share "sw").

Drive is read without credentials, through the link-shared course folder, with
the helpers in check_course.py. Downloaded files are only checked in memory
(file signature, PDF page count) and written to the output folder; nothing
downloaded is executed.
"""

import argparse
import concurrent.futures as cf
import json
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
    key = "/".join(package["folder"][:-1]) if package.get("sharedResources") else package["id"]
    return key, candidates[0]


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


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("command", choices=["export"])
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
        return cmd_export(settings, packages, args.out)
    except BuildError as e:
        print("ERROR", e)
        return 1


if __name__ == "__main__":
    sys.exit(main())

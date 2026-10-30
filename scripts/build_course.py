#!/usr/bin/env python3
"""Builds the offline "AI Literacy for Everyone" course packages from Google Drive.

Reads course/settings.json and works through the packages listed there. Each
stage is its own command, so they can be run and checked one at a time, or
all together with `all` (export, compress, download, assemble and zip; the
release stays a separate step). See course/README.md for releasing a version.

    python -I scripts/build_course.py all [--package ID ...] [--out build/course]
    python -I scripts/build_course.py export [--package ID ...] [--out build/course]
    python -I scripts/build_course.py compress [--package ID ...] [--out build/course]
    python -I scripts/build_course.py download [--package ID ...] [--out build/course]
    python -I scripts/build_course.py assemble [--package ID ...] [--out build/course]
    python -I scripts/build_course.py zip [--package ID ...] [--out build/course]
    python -I scripts/build_course.py release [--publish] [--out build/course]
    python -I scripts/build_course.py links [--out build/course]
    python -I scripts/build_course.py online [--package ID ...] [--out build/course]
    python -I scripts/build_course.py videos [--package ID ...] [--out build/course]

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
assemble Puts each package together in build/course/packages/<package id>/<folder>/:
         START HERE.html (course/player with the course data, the captions and the
         language's text from course/translations/<lang>/player.json built in),
         neuropocket.html (the pinned release, checked against its fingerprint),
         content/ with the videos, the shared apps (scripts/build-apps.mjs) and the
         shrunk PDFs. Lessons keep Drive's numbered order; each activity becomes the
         matching app, recognised by the English activity in the same place, and
         the NeuroPocket step moves after the how-to video. Needs export, compress
         and download first (download for en too, as the reference).
zip      Zips each assembled package as build/course/zips/<slug>-<id>-v<version>.zip
         (one top-level folder; videos, PDFs and pictures stored as they are,
         everything else compressed), checks every zip opens and matches the
         folder, and writes build/course/zips/downloads.json: file, size, sha256
         and date for each package, for the release and the website.
release  Uploads the zips to the GitHub release named in settings (release.repo,
         tag course-v<version>) with the gh CLI, as a draft unless --publish, and
         writes course/downloads.json (the zips' download links, sizes, dates and
         sha256) for the website. The repo must be public for people to download.
links    Adds each package's single files to course/downloads.json without a new
         release: Google export links for the guide, worksheet and example (PDF,
         Word) and slides (PDF, PowerPoint), with the sizes from the export
         manifest, and the package's Drive folder for the videos. release does
         this too. Needs export first.
online   Writes the online kit, course/online/<package id>/index.html: the
         package's START HERE page with its videos streamed from online.videoUrl
         in the settings, its PDFs as Google previews of the masters, its apps from the
         website's /course/apps/ and NeuroPocket from /course/online/ (put there
         by scripts/build-online.mjs). Needs assemble and export first.
videos   Uploads each package's videos as <package id>-<section>-<NN>.mp4 to the
         release named by online.videoRelease in the settings (created the first
         time, public, never marked Latest), for the online kit; ones already
         there with the same size are skipped.

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
    """(sections, items, activities) for a package, read from Drive with check_course's
    lesson scan: sections is {section: Drive folder name}, items [(section, number,
    video entry, caption entry)], activities [(section, number, Drive file name)] for
    the numbered non-video files (quizzes, worksheets, install steps), whose places
    in the lesson order the START HERE page keeps. Raises BuildError on any layout problem."""
    _parent, folder = package_folder(settings, package)
    rep = drive.Report()
    lessons, _res = drive.classify_version_folder(
        package["id"], drive.list_folder(folder.id, folder.path), rep, folder.path,
        not package.get("sharedResources"))
    sections = {section: lesson.name for section, lesson in sorted(lessons.items())}
    items, activities = [], []
    for section, lesson in sorted(lessons.items()):
        scan = drive.scan_lesson(package["id"], lesson, rep)
        for num, acts in sorted(scan["acts"].items()):
            activities.append((section, num, acts[0].name))
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
    return sections, items, activities


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

        sections, items, activities = media_items(settings, p)
        jobs = []  # (record, entry, path, check)
        manifest = {
            "package": p["id"],
            "sections": [{"section": s, "name": name} for s, name in sorted(sections.items())],
            "activities": [{"section": s, "number": n, "name": name} for s, n, name in activities],
            "items": [],
        }
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


PLAYER = os.path.join(REPO, "course", "player")
TRANSLATIONS = os.path.join(REPO, "course", "translations")
NEUROPOCKET_URL = "https://github.com/ousecTic/neuropocket/releases/download/v{version}/{file}"
PDF_NAMES = {1: "1-teacher-guide.pdf", 2: "2-worksheet.pdf", 3: "3-worksheet-example.pdf", 4: "4-slides.pdf"}
NUMBER_PREFIX = re.compile(r"^\s*\d+\s*-\s*")
TRAILING_NOTE = re.compile(r"\s*\([^()]*\)\s*$")


def classify_activity(english_name):
    """What an activity in the English course is, from its Drive name: (kind, app, query)."""
    if re.search(r"AI or Not", english_name, re.I):
        return "Quiz", "ai-or-not", {}
    if re.search(r"Recap Quiz", english_name, re.I):
        return "Quiz", "recap-quiz", {"quiz": None}
    if re.search(r"Worksheet", english_name, re.I):
        return "Worksheet", "worksheet", {"lesson": None}
    if re.search(r"Install NeuroPocket", english_name, re.I):
        return "App", "neuropocket", {}
    raise BuildError(f"don't know which app to use for the English activity {english_name!r}")


def neuropocket_file(settings, out):
    """The pinned NeuroPocket release file, downloaded once and checked against its fingerprint."""
    import hashlib

    np = settings["neuropocket"]
    path = os.path.join(out, "neuropocket", np["version"], np["file"])
    if not os.path.isfile(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        data = drive.fetch(NEUROPOCKET_URL.format(**np))
        with open(path + ".part", "wb") as f:
            f.write(data)
        os.replace(path + ".part", path)
    with open(path, "rb") as f:
        digest = hashlib.sha256(f.read()).hexdigest()
    if digest != np["sha256"]:
        os.remove(path)
        raise BuildError(f"NeuroPocket {np['version']} doesn't match the fingerprint in course/settings.json")
    return path


def data_url(path, mime):
    import base64

    with open(path, "rb") as f:
        return f"data:{mime};base64," + base64.b64encode(f.read()).decode("ascii")


def script_json(value):
    """JSON safe to put inside a <script> element."""
    return (json.dumps(value, ensure_ascii=False)
            .replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029"))


def read_json(*parts):
    with open(os.path.join(*parts), encoding="utf-8") as f:
        return json.load(f)


def cmd_assemble(settings, packages, out):
    import shutil
    import subprocess

    languages = {l["code"]: l for l in read_json(TRANSLATIONS, "languages.json")}
    english = read_json(out, "media", "en", "manifest.json")
    english_acts = {(a["section"], a["number"]): a["name"] for a in english["activities"]}
    english_videos = {(i["section"], i["number"]): i["title"] for i in english["items"]}

    subprocess.run(["node", os.path.join(REPO, "scripts", "build-apps.mjs"), "--out", out],
                   check=True, stdout=subprocess.DEVNULL)
    np_path = neuropocket_file(settings, out)
    template = open(os.path.join(PLAYER, "index.html"), encoding="utf-8").read()
    assets = {
        "__LAIA_LOGO__": data_url(os.path.join(PLAYER, "assets", "learn-ai-anywhere-logo.png"), "image/png"),
        "__NP_ICON__": data_url(os.path.join(PLAYER, "assets", "neuropocket-icon.png"), "image/png"),
        "__INTER_FONT__": data_url(os.path.join(PLAYER, "assets", "inter-latin.woff2"), "font/woff2"),
    }
    course = settings["course"]

    for p in packages:
        lang = p["lang"]
        media_dir = os.path.join(out, "media", p["id"])
        media = read_json(media_dir, "manifest.json")
        ui = read_json(TRANSLATIONS, lang, "player.json")["ui"]
        key = resources_key(p)
        exports = read_json(out, "exports", key, "manifest.json")
        folder_name = f"{course['name']} - {p['name']}"
        pkg_root = os.path.join(out, "packages", p["id"])
        dest = os.path.join(pkg_root, folder_name)
        if os.path.isdir(pkg_root):
            shutil.rmtree(pkg_root)
        content = os.path.join(dest, "content")
        os.makedirs(content)

        shutil.copytree(os.path.join(out, "apps"), os.path.join(content, "apps"))
        shutil.copyfile(np_path, os.path.join(dest, "neuropocket.html"))

        # Lessons: videos and activities in Drive's numbered order.
        entries = {}
        for it in media["items"]:
            entries[(it["section"], it["number"])] = ("video", it)
        for a in media["activities"]:
            entries[(a["section"], a["number"])] = ("activity", a)
        if set(k for k, (kind, _x) in entries.items() if kind == "activity") != set(english_acts):
            raise BuildError(f"{p['id']}: its activities aren't in the same places as the English course's")

        sections = []
        for s in media["sections"]:
            n = s["section"]
            sid = "intro" if n == 0 else f"lesson-{n}"
            if n == 0:
                kicker, title = ui["introKicker"], s["name"]
            else:
                head, _sep, rest = s["name"].partition(" - ")
                kicker, title = head.strip(), rest.strip() or s["name"]
            sec = {"id": sid, "kicker": kicker, "title": title, "items": []}
            for (sec_n, num), (kind, x) in sorted(entries.items()):
                if sec_n != n:
                    continue
                item_id = f"{sid}/{num:02d}"
                if kind == "video":
                    rel = f"content/{sid}/{num:02d}.mp4"
                    os.makedirs(os.path.join(content, sid), exist_ok=True)
                    shutil.copyfile(os.path.join(media_dir, x["video"]["file"]), os.path.join(dest, rel))
                    with open(os.path.join(media_dir, x["caption"]["file"]), encoding="utf-8-sig") as f:
                        vtt = f.read()
                    item = {"id": item_id, "title": NUMBER_PREFIX.sub("", x["title"]), "type": "video",
                            "kind": "Video", "src": rel, "vtt": vtt}
                    if re.search(r"Bearly a Dog", english_videos.get((n, num), ""), re.I):
                        item["action"] = "challenge"
                else:
                    akind, app, query = classify_activity(english_acts[(n, num)])
                    if app == "neuropocket":
                        item = {"id": item_id, "title": ui["openNeuroPocket"], "type": "app", "kind": "App"}
                    else:
                        params = {k: (v if v is not None else n) for k, v in query.items()}
                        params["lang"] = lang
                        qs = "&".join(f"{k}={v}" for k, v in params.items())
                        name = TRAILING_NOTE.sub("", NUMBER_PREFIX.sub("", x["name"].rsplit(".", 1)[0]))
                        item = {"id": item_id, "title": name.strip(), "type": "html", "kind": akind,
                                "src": f"content/apps/{app}/index.html?{qs}"}
                if kind == "video":
                    item["howTo"] = bool(re.search(r"How to Use NeuroPocket", english_videos.get((n, num), ""), re.I))
                sec["items"].append(item)
            # The NeuroPocket step takes the place of "Install NeuroPocket", which comes
            # before the how-to video; students watch that first, then open the app.
            apps = [i for i, it in enumerate(sec["items"]) if it["type"] == "app"]
            how_to = [i for i, it in enumerate(sec["items"]) if it.pop("howTo", False)]
            if apps and how_to and apps[0] < how_to[0]:
                sec["items"].insert(how_to[0], sec["items"].pop(apps[0]))
            sections.append(sec)

        # Resources: the shrunk PDFs.
        res_dir = os.path.join(content, "resources")
        os.makedirs(res_dir)
        res = {"id": "resources", "kicker": ui["resourcesKicker"],
               "title": exports["folder"].rstrip("/").rsplit("/", 1)[-1], "items": []}
        for m in exports["masters"]:
            src = os.path.join(out, "pdfs", key, m["files"]["pdf"]["file"])
            rel = f"content/resources/{PDF_NAMES[m['number']]}"
            shutil.copyfile(src, os.path.join(dest, rel))
            res["items"].append({"id": f"resources/{m['number']}", "title": NUMBER_PREFIX.sub("", m["title"]),
                                 "type": "pdf", "kind": "PDF", "src": rel, "size": os.path.getsize(src)})
        sections.append(res)

        data = {
            "package": p["id"], "lang": lang, "dir": languages[lang]["dir"], "version": course["version"],
            "courseName": course["name"], "neuropocket": f"neuropocket.html?lang={lang}",
            "captionLabel": languages[lang]["label"], "ui": ui, "sections": sections,
        }
        page = template
        if "/*COURSE_DATA*/null" not in page:
            raise BuildError("course/player/index.html has no /*COURSE_DATA*/null marker")
        page = page.replace("/*COURSE_DATA*/null", script_json(data), 1)
        for k, v in assets.items():
            page = page.replace(k, v)
        leftover = re.search(r"__[A-Z_]+__", page)
        if leftover:
            raise BuildError(f"START HERE.html still has {leftover.group(0)}")
        with open(os.path.join(dest, "START HERE.html"), "w", encoding="utf-8", newline="\n") as f:
            f.write(page)

        # Every file the page points at must be in the package.
        for sec in sections:
            for it in sec["items"]:
                if "src" in it and not os.path.isfile(os.path.join(dest, it["src"].split("?")[0])):
                    raise BuildError(f"{p['id']}: {it['src']} is missing")
        count = sum(len(s["items"]) for s in sections)
        size = sum(os.path.getsize(os.path.join(r, f)) for r, _d, fs in os.walk(dest) for f in fs)
        print(f"{p['id']:6} {count} items in {len(sections)} sections, {size / 1e6:.0f} MB -> {dest}")
    return 0


STORED = (".mp4", ".pdf", ".png", ".jpg", ".jpeg", ".woff2")  # already compressed


def zip_name(settings, package):
    c = settings["course"]
    return f"{c['slug']}-{package['id']}-v{c['version']}.zip"


def cmd_zip(settings, packages, out):
    import datetime
    import hashlib
    import zipfile

    zip_dir = os.path.join(out, "zips")
    os.makedirs(zip_dir, exist_ok=True)
    index_path = os.path.join(zip_dir, "downloads.json")
    index = {"course": settings["course"]["name"], "version": settings["course"]["version"], "packages": []}
    if os.path.isfile(index_path):
        index["packages"] = read_json(index_path).get("packages", [])
    for p in packages:
        pkg_root = os.path.join(out, "packages", p["id"])
        folders = os.listdir(pkg_root) if os.path.isdir(pkg_root) else []
        if len(folders) != 1:
            raise BuildError(f"{pkg_root}: no assembled package; run the assemble command first")
        top = folders[0]
        files = sorted(os.path.relpath(os.path.join(r, f), pkg_root).replace(os.sep, "/")
                       for r, _d, fs in os.walk(os.path.join(pkg_root, top)) for f in fs)
        name = zip_name(settings, p)
        path = os.path.join(zip_dir, name)
        with zipfile.ZipFile(path + ".part", "w") as z:
            for rel in files:
                method = zipfile.ZIP_STORED if rel.lower().endswith(STORED) else zipfile.ZIP_DEFLATED
                z.write(os.path.join(pkg_root, rel), rel, compress_type=method, compresslevel=9 if method else None)
        os.replace(path + ".part", path)

        # The zip must open and hold exactly the package's files, intact.
        with zipfile.ZipFile(path) as z:
            bad = z.testzip()
            names = sorted(i.filename for i in z.infolist())
        if bad or names != files:
            raise BuildError(f"{name}: zip check failed ({bad or 'file list differs'})")
        h = hashlib.sha256()
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(1 << 20), b""):
                h.update(chunk)
        record = {"id": p["id"], "name": p["name"], "lang": p["lang"], "file": name, "folder": top,
                  "bytes": os.path.getsize(path), "sha256": h.hexdigest(),
                  "date": datetime.date.today().isoformat()}
        index["packages"] = [r for r in index["packages"] if r["id"] != p["id"]] + [record]
        print(f"{p['id']:6} {name}  {record['bytes'] / 1e6:.0f} MB, {len(files)} files")
    order = [p["id"] for p in settings["packages"]]
    index["packages"].sort(key=lambda r: order.index(r["id"]) if r["id"] in order else len(order))
    with open(index_path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
        f.write("\n")
    return 0


RELEASE_URL = "https://github.com/{repo}/releases/download/{tag}/{file}"

# The website's single-file buttons: master number -> (key, export formats). The
# links export straight from the link-shared Google masters, so they always give
# the current version with no sign-in.
LINKS = {1: ("guide", ("pdf", "docx")), 2: ("worksheet", ("pdf", "docx")),
         3: ("example", ("pdf", "docx")), 4: ("slides", ("pdf", "pptx"))}
DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/{id}"


def resource_links(settings, package, out):
    """A package's single files for the website: export links for the masters (from the
    export manifest, with each file's size) and its Drive folder, which holds the videos."""
    manifest = read_json(out, "exports", resources_key(package), "manifest.json")
    links = {}
    for m in manifest["masters"]:
        key, formats = LINKS[m["number"]]
        mime = drive.RESOURCES[m["number"]][1]
        suffixes = {f: s for f, s, _sig in EXPORTS[mime]}
        for fmt in formats:
            links[key + fmt.capitalize()] = {"url": EXPORT_BASE[mime].format(id=m["id"]) + suffixes[fmt],
                                             "bytes": m["files"][fmt]["bytes"]}
    links["videosFolder"] = {"url": DRIVE_FOLDER_URL.format(id=package_folder(settings, package)[1].id)}
    return links


def write_downloads(settings, downloads, out):
    """Writes course/downloads.json, with each package's single-file links added."""
    by_id = {p["id"]: p for p in settings["packages"]}
    for r in downloads["packages"]:
        r["resources"] = resource_links(settings, by_id[r["id"]], out)
    path = os.path.join(REPO, "course", "downloads.json")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(downloads, f, ensure_ascii=False, indent=2)
        f.write("\n")
    return path


ONLINE_DIR = os.path.join(REPO, "course", "online")
PREVIEW_URL = {drive.DOC: "https://docs.google.com/document/d/{id}/preview",
               drive.SLIDES: "https://docs.google.com/presentation/d/{id}/preview"}


def video_asset(package, src):
    """The release file name of one of a package's videos: "en-lesson-1-02.mp4" for
    content/lesson-1/02.mp4. Every version's release holds all of them."""
    return f"{package['id']}-" + src.removeprefix("content/").replace("/", "-")


def read_course_data(page):
    """The course data built into a START HERE page, and where it sits in the page."""
    start = page.index("var COURSE = ") + len("var COURSE = ")
    data, end = json.JSONDecoder().raw_decode(page, start)
    return data, start, end


def cmd_online(settings, packages, out):
    """Writes the online kit: course/online/<id>/index.html, each package's START HERE
    page with its files pointed elsewhere, since the website can't hold the videos.
    Videos stream from online.videoUrl in the settings (see the videos command), PDFs are Google's
    preview of the masters, the apps are the website's own copies (/course/apps/), and
    NeuroPocket is one shared copy (scripts/build-online.mjs puts it at /course/online/)."""
    version = settings["course"]["version"]
    for p in packages:
        pkg_root = os.path.join(out, "packages", p["id"])
        folders = os.listdir(pkg_root) if os.path.isdir(pkg_root) else []
        if len(folders) != 1:
            raise BuildError(f"{pkg_root}: no assembled package; run the assemble command first")
        with open(os.path.join(pkg_root, folders[0], "START HERE.html"), encoding="utf-8") as f:
            page = f.read()
        data, start, end = read_course_data(page)
        masters = {m["number"]: m for m in read_json(out, "exports", resources_key(p), "manifest.json")["masters"]}
        for sec in data["sections"]:
            for it in sec["items"]:
                src = it.get("src", "")
                if it["type"] == "video":
                    it["src"] = settings["online"]["videoUrl"].format(version=version, file=video_asset(p, src))
                elif src.startswith("content/apps/"):
                    it["src"] = "/course/apps/" + src.removeprefix("content/apps/")
                elif it["type"] == "pdf":
                    n = int(it["id"].split("/")[1])
                    it["src"] = PREVIEW_URL[drive.RESOURCES[n][1]].format(id=masters[n]["id"])
                elif src:
                    raise BuildError(f"{p['id']}: don't know where {src} lives online")
        data["neuropocket"] = "/course/online/" + data["neuropocket"]
        # The intro's second sentence says everything works without the internet, which
        # isn't true online; keep only the first (".", Hindi "।", Urdu "۔").
        first = re.match(r"^(.*?[.।۔])\s", data["ui"]["heroText"])
        if not first:
            raise BuildError(f"{p['id']}: can't find the first sentence of the player's heroText")
        data["ui"]["heroText"] = first.group(1)
        dest = os.path.join(ONLINE_DIR, p["id"])
        os.makedirs(dest, exist_ok=True)
        with open(os.path.join(dest, "index.html"), "w", encoding="utf-8", newline="\n") as f:
            f.write(page[:start] + script_json(data) + page[end:])
        print(f"{p['id']:6} course/online/{p['id']}/index.html")
    return 0


def cmd_videos(settings, packages, out):
    """Uploads each package's videos under their video_asset names to the release named
    by online.videoRelease, for the online kit, creating it (public, never marked Latest)
    the first time. Files already there with the same size are skipped."""
    import shutil
    import subprocess
    import tempfile

    rel = settings["release"]
    version = settings["course"]["version"]
    tag = settings["online"]["videoRelease"].format(version=version)

    def gh(*args, check=True):
        return subprocess.run(["gh", *args, "--repo", rel["repo"]], check=check, capture_output=True, text=True)

    if gh("release", "view", tag, check=False).returncode != 0:
        notes = (f"The videos of {settings['course']['name']} {version}, one file per video, for the online "
                 f"kit on the website. To use the course offline, download a zip from {rel['tag'].format(version=version)}.")
        gh("release", "create", tag, "--target", "master", "--latest=false",
           "--title", f"{settings['course']['name']} {version}: videos for the online kit", "--notes", notes)
    have = {a["name"]: a["size"] for a in json.loads(gh("release", "view", tag, "--json", "assets").stdout)["assets"]}
    for p in packages:
        pkg_root = os.path.join(out, "packages", p["id"])
        top = os.path.join(pkg_root, os.listdir(pkg_root)[0])
        with open(os.path.join(top, "START HERE.html"), encoding="utf-8") as f:
            data = read_course_data(f.read())[0]
        videos = [it["src"] for sec in data["sections"] for it in sec["items"] if it["type"] == "video"]
        todo = [s for s in videos if have.get(video_asset(p, s)) != os.path.getsize(os.path.join(top, s))]
        with tempfile.TemporaryDirectory() as tmp:
            paths = []
            for s in todo:
                path = os.path.join(tmp, video_asset(p, s))
                try:
                    os.link(os.path.join(top, s), path)  # same disk: no copy needed
                except OSError:
                    shutil.copyfile(os.path.join(top, s), path)
                paths.append(path)
            for i in range(0, len(paths), 10):
                gh("release", "upload", tag, *paths[i:i + 10], "--clobber")
        print(f"{p['id']:6} {len(videos)} videos, {len(todo)} uploaded")
    return 0


def cmd_links(settings, out):
    """Adds the single-file links to the published course/downloads.json, without a release."""
    downloads = read_json(REPO, "course", "downloads.json")
    write_downloads(settings, downloads, out)
    for r in downloads["packages"]:
        print(f"{r['id']:6} {len(r['resources'])} links")
    return 0


def cmd_release(settings, publish, out):
    import subprocess
    import tempfile

    rel = settings["release"]
    version = settings["course"]["version"]
    tag = rel["tag"].format(version=version)
    index = read_json(out, "zips", "downloads.json")
    if index["version"] != version:
        raise BuildError(f"the zips are for version {index['version']}, settings say {version}; run zip again")
    missing = [p["id"] for p in settings["packages"] if p["id"] not in {r["id"] for r in index["packages"]}]
    if missing:
        raise BuildError("no zip yet for: " + ", ".join(missing))
    files = [os.path.join(out, "zips", r["file"]) for r in index["packages"]]

    def gh(*args, check=True):
        return subprocess.run(["gh", *args, "--repo", rel["repo"]], check=check, capture_output=True, text=True)

    existing = gh("release", "view", tag, "--json", "isDraft", check=False)
    if existing.returncode == 0 and not json.loads(existing.stdout)["isDraft"]:
        raise BuildError(f"{tag} is already published; people may have downloaded it. "
                         "Change the version in course/settings.json and build again.")
    if existing.returncode != 0:
        lines = [f"{settings['course']['name']}, version {version}: the offline course packages.", "",
                 "Unzip a package and open START HERE.html. Everything works without the internet.", ""]
        lines += [f"- {r['name']}: `{r['file']}` ({r['bytes'] / 1e6:.0f} MB)" for r in index["packages"]]
        with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")
        try:
            gh("release", "create", tag, "--draft", "--target", "master",
               "--title", f"{settings['course']['name']} {version}", "--notes-file", f.name)
        finally:
            os.remove(f.name)
    for path in files:
        gh("release", "upload", tag, path, "--clobber")
        print("uploaded", os.path.basename(path))
    if publish:
        gh("release", "edit", tag, "--draft=false")

    downloads = {"course": index["course"], "version": version, "release": tag, "packages": [
        {**r, "url": RELEASE_URL.format(repo=rel["repo"], tag=tag, file=r["file"])} for r in index["packages"]]}
    downloads_path = write_downloads(settings, downloads, out)
    if publish:
        publish_latest(gh, rel, settings, downloads_path)
    state = "published" if publish else "saved as a draft (publish with --publish)"
    print(f"release {tag} on {rel['repo']} {state}; wrote course/downloads.json")
    return 0


def publish_latest(gh, rel, settings, downloads_path):
    """Puts downloads.json on the release that never changes address (release.latestTag), so
    installed copies of the app can find the newest course version."""
    latest = rel["latestTag"]
    if gh("release", "view", latest, check=False).returncode != 0:
        notes = ("The list of the newest course packages, for the AI Literacy app. "
                 "Every published course version replaces downloads.json here.")
        gh("release", "create", latest, "--target", "master", "--latest=false",
           "--title", f"{settings['course']['name']}: newest version", "--notes", notes)
    gh("release", "upload", latest, downloads_path, "--clobber")
    print(f"updated downloads.json on {latest}: " + RELEASE_URL.format(repo=rel["repo"], tag=latest, file="downloads.json"))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("command", choices=["all", "export", "compress", "download", "assemble", "zip", "release", "links",
                                        "online", "videos"])
    ap.add_argument("--publish", action="store_true", help="release: publish instead of leaving a draft")
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
        if args.command == "all":
            # English is the reference for the course order, so its media is always fetched.
            english = [p for p in settings["packages"] if p["id"] == "en"]
            steps = [
                ("export", lambda: cmd_export(settings, packages, args.out)),
                ("compress", lambda: cmd_compress(packages, args.out)),
                ("download", lambda: cmd_download(settings, english + [p for p in packages if p["id"] != "en"], args.out)),
                ("assemble", lambda: cmd_assemble(settings, packages, args.out)),
                ("zip", lambda: cmd_zip(settings, packages, args.out)),
            ]
            for name, step in steps:
                print(f"--- {name}")
                if step():
                    print(f"Stopped at {name}.")
                    return 1
            print("--- done. Check the packages in build/course/packages, then run: "
                  "python -I scripts/build_course.py release")
            return 0
        if args.command == "compress":
            return cmd_compress(packages, args.out)
        if args.command == "download":
            return cmd_download(settings, packages, args.out)
        if args.command == "assemble":
            return cmd_assemble(settings, packages, args.out)
        if args.command == "zip":
            return cmd_zip(settings, packages, args.out)
        if args.command == "release":
            return cmd_release(settings, args.publish, args.out)
        if args.command == "links":
            return cmd_links(settings, args.out)
        if args.command == "online":
            return cmd_online(settings, packages, args.out)
        if args.command == "videos":
            return cmd_videos(settings, packages, args.out)
        return cmd_export(settings, packages, args.out)
    except BuildError as e:
        print("ERROR", e)
        return 1


if __name__ == "__main__":
    sys.exit(main())

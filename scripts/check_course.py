#!/usr/bin/env python3
"""Completeness check for the "AI Literacy for Everyone" course content in Google Drive.

Walks the link-shared course folder without credentials and prints, per language
version, every missing or suspicious item. Exits 1 if anything is missing, so a
build pipeline can stop on a gap.

    python -I scripts/check_course.py [--root FOLDER_ID] [--no-pages] [--no-vtt] [--no-mp4]

Expected layout (English is the reference for which items each lesson has):

    <root>/
      en — English/
        Introduction/            videos "N - Title.mp4", activities "N - Title.zip"
          Subtitles/             "N - Title.vtt", one per video
        Lesson 1 - …/ … Lesson 4 - …/   same as Introduction
        Resources/               1 - Teacher Guide (Doc), 2 - Worksheet (Doc),
                                 3 - Worksheet example (Doc), 4 - Slides (Slides)
      fr …/ es …/ pt …/ ar …/ hi …/ ur …/   same, names in that language
      sw …/
        sw-KE …/  sw-TZ …/       lessons only
        Rasilimali/              resources shared by both versions

Downloaded files are treated as untrusted data: they are only read in memory
(VTT header check, PDF page count) and never written or executed.
"""

import argparse
import concurrent.futures as cf
import hashlib
import html
import re
import sys
import time
import urllib.error
import urllib.request

ROOT_ID = "1icEyszg_HXjxPHUZmlp_1_Zb3icZpR1p"
LANGS = ["en", "fr", "es", "pt", "ar", "hi", "ur", "sw"]
SW_VERSIONS = ["sw-KE", "sw-TZ"]

FOLDER = "application/vnd.google-apps.folder"
DOC = "application/vnd.google-apps.document"
SLIDES = "application/vnd.google-apps.presentation"
# Resource slot -> (role, expected mime, expected PDF pages or None)
RESOURCES = {
    1: ("Teacher Guide", DOC, 3),
    2: ("Worksheet", DOC, 1),
    3: ("Worksheet example", DOC, 1),
    4: ("Slides", SLIDES, None),
}
LEFTOVER_EXT = (".docx", ".pdf", ".pptx")

NUMBERED = re.compile(r"^\s*(\d+)\s*-\s*(.+?)\s*$")
LESSON_DIR = re.compile(r"(\d+)\s*-\s*\S")  # "Lesson 1 - …", "الدرس 1 - …", "Somo la 1 - …"
UA = {"User-Agent": "Mozilla/5.0 (check_course.py)"}


# ---------------------------------------------------------------- Drive access

def fetch(url, retries=4, limit=None):
    """GET a URL and return its bytes (at most `limit` bytes if given)."""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read(limit) if limit else r.read()
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            if isinstance(e, urllib.error.HTTPError) and e.code in (403, 404):
                raise
            if attempt == retries - 1:
                raise
            time.sleep(2 * (attempt + 1))


def probe_head(file_id, nbytes=32):
    """First bytes of a file and its total size (from Content-Range), via a ranged download."""
    url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t"
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={**UA, "Range": f"bytes=0-{nbytes - 1}"})
            with urllib.request.urlopen(req, timeout=120) as r:
                total = (r.headers.get("Content-Range") or "").rpartition("/")[2]
                return r.read(nbytes), int(total) if total.isdigit() else None
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            if (isinstance(e, urllib.error.HTTPError) and e.code in (403, 404)) or attempt == 3:
                raise
            time.sleep(2 * (attempt + 1))


class Entry:
    def __init__(self, id, name, mime, path):
        self.id, self.name, self.mime, self.path = id, name, mime, path

    @property
    def is_folder(self):
        return self.mime == FOLDER

    def __repr__(self):
        return f"Entry({self.name!r}, {self.mime})"


_listing_cache = {}


def list_folder(folder_id, path):
    """List a link-shared folder via the embedded folder view."""
    if folder_id in _listing_cache:
        return _listing_cache[folder_id]
    page = fetch(f"https://drive.google.com/embeddedfolderview?id={folder_id}").decode("utf-8", "replace")
    entries = []
    for chunk in page.split('<div class="flip-entry" ')[1:]:
        id_m = re.search(r'id="entry-([^"]+)"', chunk)
        title_m = re.search(r'<div class="flip-entry-title">(.*?)</div>', chunk, re.S)
        href_m = re.search(r'<a href="([^"]+)"', chunk)
        if not (id_m and title_m and href_m):
            continue
        href = html.unescape(href_m.group(1))
        mime_m = re.search(r'/type/([^"?]+)"', chunk)
        if "/drive/folders/" in href:
            mime = FOLDER
        elif mime_m:
            mime = html.unescape(mime_m.group(1))
        elif "docs.google.com/document/" in href:
            mime = DOC
        elif "docs.google.com/presentation/" in href:
            mime = SLIDES
        else:
            mime = "unknown"
        name = html.unescape(re.sub(r"<[^>]+>", "", title_m.group(1))).strip()
        entries.append(Entry(id_m.group(1), name, mime, f"{path}/{name}"))
    entries.sort(key=lambda e: e.name)
    _listing_cache[folder_id] = entries
    return entries


def pdf_page_count(data):
    """Page count of a PDF given as bytes (pymupdf if available, else /Count of the page tree)."""
    try:
        import pymupdf
        with pymupdf.open(stream=data, filetype="pdf") as doc:
            return doc.page_count
    except ImportError:
        pass
    # Google's exports are uncompressed enough for the page tree root to be readable:
    # the largest /Count is the root's.
    counts = [int(c) for c in re.findall(rb"/Type\s*/Pages\b[^>]*?/Count\s+(\d+)", data)]
    counts += [int(c) for c in re.findall(rb"/Count\s+(\d+)[^>]*?/Type\s*/Pages\b", data)]
    if counts:
        return max(counts)
    return len(re.findall(rb"/Type\s*/Page\b(?!s)", data))


# ---------------------------------------------------------------- reporting

class Report:
    def __init__(self):
        self.items = []  # (version, level, path, message)

    def add(self, version, level, path, msg):
        self.items.append((version, level, path, msg))

    def error(self, version, path, msg):
        self.add(version, "ERROR", path, msg)

    def warn(self, version, path, msg):
        self.add(version, "WARN", path, msg)

    def info(self, version, path, msg):
        self.add(version, "INFO", path, msg)

    def count(self, version, level):
        return sum(1 for v, l, _, _ in self.items if v == version and l == level)


def numbered(entries, ext):
    """{number: [entries]} for files named "N - Title<ext>"."""
    out = {}
    for e in entries:
        if e.is_folder or not e.name.lower().endswith(ext):
            continue
        m = NUMBERED.match(e.name[: -len(ext)])
        if m:
            out.setdefault(int(m.group(1)), []).append(e)
    return out


# ---------------------------------------------------------------- lessons

def classify_version_folder(version, entries, rep, path, has_resources):
    """Split a version folder into {0: intro, 1..4: lessons} and the resources folder."""
    lessons, resources, others = {}, None, []
    for e in entries:
        if not e.is_folder:
            rep.warn(version, e.path, f"unexpected file in version folder ({e.mime})")
            continue
        m = LESSON_DIR.search(e.name)
        if m:
            n = int(m.group(1))
            if n in lessons:
                rep.error(version, e.path, f"two folders for lesson {n}: {lessons[n].name!r} and {e.name!r}")
            lessons[n] = e
        else:
            others.append(e)
    # Of the unnumbered folders, the one holding videos or a subfolder is the Introduction;
    # one holding Google-native docs is Resources.
    for e in others:
        kids = list_folder(e.id, e.path)
        if any(k.name.lower().endswith(".mp4") or k.is_folder for k in kids):
            if 0 in lessons:
                rep.error(version, e.path, f"second introduction-like folder (also {lessons[0].name!r})")
            lessons[0] = e
        elif has_resources and any(k.mime in (DOC, SLIDES) for k in kids) and resources is None:
            resources = e
        else:
            rep.warn(version, e.path, "unrecognised folder")
    for n in range(5):
        if n not in lessons:
            what = "Introduction" if n == 0 else f"Lesson {n}"
            rep.error(version, path, f"missing {what} folder")
    for n in sorted(set(lessons) - set(range(5))):
        rep.warn(version, lessons[n].path, f"unexpected lesson number {n}")
    return lessons, resources


def scan_lesson(version, folder, rep):
    """Return {"videos": {n: [e]}, "acts": {n: [e]}, "caps": {n: [e]}, "subs": folder|None}."""
    kids = list_folder(folder.id, folder.path)
    subdirs = [k for k in kids if k.is_folder]
    files = [k for k in kids if not k.is_folder]
    videos = numbered(files, ".mp4")
    acts = {}
    for e in files:
        if e.name.lower().endswith(".mp4"):
            if not NUMBERED.match(e.name[:-4]):
                rep.error(version, e.path, 'video name is not "N - Title.mp4"')
            continue
        m = NUMBERED.match(e.name)
        if m:
            acts.setdefault(int(m.group(1)), []).append(e)
        else:
            rep.warn(version, e.path, f"unexpected file in lesson folder ({e.mime})")
    subs = None
    if len(subdirs) != 1:
        if not subdirs:
            rep.error(version, folder.path, "no subtitles subfolder")
        else:
            rep.error(version, folder.path, f"{len(subdirs)} subfolders, expected 1: " + ", ".join(s.name for s in subdirs))
    if subdirs:
        subs = subdirs[0]
    caps, stray = {}, []
    if subs:
        for e in list_folder(subs.id, subs.path):
            if e.is_folder:
                rep.warn(version, e.path, "unexpected folder inside subtitles folder")
            elif not e.name.lower().endswith(".vtt"):
                stray.append(e.name)
            elif not NUMBERED.match(e.name[:-4]):
                rep.error(version, e.path, 'caption name is not "N - Title.vtt"')
            else:
                caps.setdefault(int(NUMBERED.match(e.name[:-4]).group(1)), []).append(e)
    if stray:
        exts = sorted({n.rsplit(".", 1)[-1].lower() if "." in n else "(no ext)" for n in stray})
        rep.warn(version, subs.path, f"{len(stray)} non-.vtt files ({', '.join('.' + x for x in exts)}) "
                                     f"next to the captions: {', '.join(sorted(stray)[:3])}{', …' if len(stray) > 3 else ''}")
    return {"videos": videos, "acts": acts, "caps": caps, "subs": subs}


def check_lesson(version, n, folder, scan, ref, rep):
    """Compare one lesson against the English reference; return counts for the table."""
    videos, acts, caps = scan["videos"], scan["acts"], scan["caps"]
    where = folder.path
    subs_path = scan["subs"].path if scan["subs"] else where + "/<subtitles>"
    for num, es in videos.items():
        if len(es) > 1:
            rep.error(version, where, f"duplicate video number {num}: " + ", ".join(e.name for e in es))
        if num in acts:
            rep.error(version, where, f"number {num} used by both a video and {acts[num][0].name!r}")
    for num, es in acts.items():
        if len(es) > 1:
            rep.warn(version, where, f"duplicate item number {num}: " + ", ".join(e.name for e in es))
    if ref is not None:
        for num in sorted(set(ref["videos"]) - set(videos)):
            rep.error(version, where, f"missing video {num} (English: {ref['videos'][num][0].name!r})")
        for num in sorted(set(videos) - set(ref["videos"])):
            rep.error(version, where, f"video {num} has no English counterpart: {videos[num][0].name!r}")
        for num in sorted(set(ref["acts"]) - set(acts)):
            rep.error(version, where, f"missing item {num} (English: {ref['acts'][num][0].name!r})")
        for num in sorted(set(acts) - set(ref["acts"])):
            rep.warn(version, where, f"item {num} has no English counterpart: {acts[num][0].name!r}")
        for num in sorted(set(ref["acts"]) & set(acts)):
            ext_ref = ref["acts"][num][0].name.rsplit(".", 1)[-1].lower()
            ext = acts[num][0].name.rsplit(".", 1)[-1].lower()
            if ext != ext_ref:
                rep.error(version, acts[num][0].path, f"item {num} is .{ext}, English is .{ext_ref}")
    # Numbering inside a lesson should run 1..N without gaps (videos and activities share it).
    used = sorted(set(videos) | set(acts))
    if used and used != list(range(1, used[-1] + 1)):
        gaps = sorted(set(range(1, used[-1] + 1)) - set(used))
        rep.warn(version, where, f"item numbering has gaps: {gaps}")
    for num in sorted(set(videos) - set(caps)):
        rep.error(version, subs_path, f"missing caption for video {num} ({videos[num][0].name!r})")
    for num, es in sorted(caps.items()):
        if num not in videos:
            rep.error(version, es[0].path, f"caption {num} matches no video")
        if len(es) > 1:
            rep.error(version, subs_path, f"duplicate captions for {num}: " + ", ".join(e.name for e in es))
        elif num in videos:
            stem_v = videos[num][0].name[:-4].strip()
            stem_c = es[0].name[:-4].strip()
            if stem_v != stem_c:
                rep.warn(version, es[0].path, f"caption title differs from video {stem_v!r}")
    return {
        "videos": len(videos),
        "acts": len(acts),
        "caps": sum(len(v) for v in caps.values()),
        "caps_ok": len(set(videos) & set(caps)),
    }


def check_vtt(version, entry, rep):
    try:
        data = fetch(f"https://drive.usercontent.google.com/download?id={entry.id}&export=download&confirm=t")
    except Exception as e:  # noqa: BLE001 - report any download failure
        rep.error(version, entry.path, f"caption download failed: {e}")
        return False
    if not data.strip():
        rep.error(version, entry.path, "caption file is empty")
        return False
    head = data.lstrip(b"\xef\xbb\xbf")[:6]
    if head != b"WEBVTT":
        rep.error(version, entry.path, f"caption does not start with WEBVTT (starts {data[:20]!r})")
        return False
    if b"-->" not in data:
        rep.error(version, entry.path, "caption has a WEBVTT header but no cues")
        return False
    return hashlib.sha256(data.lstrip(b"\xef\xbb\xbf").replace(b"\r\n", b"\n").strip()).hexdigest()


# ---------------------------------------------------------------- resources

def check_resources(version, folder, rep, check_pages, en_names):
    """Check the four masters; return {"slots": "1234" style string, "pages": {n: count}}."""
    result = {"found": 0, "pages": {}, "leftovers": 0}
    if folder is None:
        rep.error(version, "(resources)", "no Resources folder found")
        return result
    kids = list_folder(folder.id, folder.path)
    slots = {}
    for e in kids:
        m = NUMBERED.match(e.name)
        if m and not e.is_folder:  # numbered: a master slot, whatever its type (checked below)
            slots.setdefault(int(m.group(1)), []).append(e)
        elif e.name.lower().endswith(LEFTOVER_EXT):
            result["leftovers"] += 1
            rep.info(version, e.path, "leftover file")
        elif e.is_folder:
            rep.warn(version, e.path, "unexpected subfolder in Resources")
        else:
            rep.warn(version, e.path, f"unexpected item in Resources ({e.mime})")
    for n, es in sorted(slots.items()):
        if n not in RESOURCES:
            rep.error(version, es[0].path, f"extra numbered file {n} ({es[0].mime})")
        if len(es) > 1:
            rep.error(version, folder.path, f"{len(es)} files numbered {n}: " + ", ".join(e.name for e in es))
    jobs = []
    for n, (role, mime, pages) in RESOURCES.items():
        es = slots.get(n)
        if not es:
            rep.error(version, folder.path, f'missing "{n} - …" ({role})')
            continue
        e = es[0]
        if e.mime != mime:
            rep.error(version, e.path, f"{role} is {e.mime}, expected {mime}")
            continue
        result["found"] += 1
        if en_names is not None and e.name == en_names.get(n):
            # A warning, not an error: some words are the same in both languages (pt "Slides").
            rep.warn(version, e.path, f"{role} title is identical to the English one")
        if pages and check_pages:
            jobs.append((n, role, pages, e))
    with cf.ThreadPoolExecutor(4) as ex:
        futs = {ex.submit(fetch, f"https://docs.google.com/document/d/{e.id}/export?format=pdf"): (n, role, pages, e)
                for n, role, pages, e in jobs}
        for fut in cf.as_completed(futs):
            n, role, pages, e = futs[fut]
            try:
                count = pdf_page_count(fut.result())
            except Exception as err:  # noqa: BLE001
                rep.error(version, e.path, f"PDF export failed: {err}")
                result["pages"][n] = "?"
                continue
            result["pages"][n] = count
            if count != pages:
                rep.error(version, e.path, f"{role} exports to {count} PDF pages, expected {pages}")
    result["slots"] = {n: es[0] for n, es in slots.items()}
    return result


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--root", default=ROOT_ID, help="course root folder ID")
    ap.add_argument("--no-pages", action="store_true", help="skip PDF page-count checks")
    ap.add_argument("--no-vtt", action="store_true", help="skip downloading captions")
    ap.add_argument("--no-mp4", action="store_true", help="skip probing the first bytes of each video")
    args = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

    rep = Report()
    root = list_folder(args.root, "")
    lang_dirs = {}
    for e in root:
        code = e.name.split()[0] if e.name.split() else ""
        if not e.is_folder:
            rep.warn("root", e.path, f"unexpected file in root ({e.mime})")
        elif code in LANGS:
            if code in lang_dirs:
                rep.error("root", e.path, f"second folder for {code}")
            lang_dirs[code] = e
        else:
            rep.warn("root", e.path, "folder is not a known language")
    for code in LANGS:
        if code not in lang_dirs:
            rep.error("root", "/", f"missing language folder {code}")

    # versions: name -> (version folder, resources owner key)
    versions, resource_dirs = {}, {}
    for code, d in lang_dirs.items():
        kids = list_folder(d.id, d.path)
        if code == "sw":
            found = {}
            rest = []
            for k in kids:
                tag = k.name.split()[0] if k.name.split() else ""
                if k.is_folder and tag in SW_VERSIONS:
                    found[tag] = k
                else:
                    rest.append(k)
            for v in SW_VERSIONS:
                if v in found:
                    versions[v] = found[v]
                else:
                    rep.error(v, d.path, f"missing {v} folder")
            natives = [k for k in rest if k.is_folder and any(
                c.mime in (DOC, SLIDES) for c in list_folder(k.id, k.path))]
            for k in rest:
                if k not in natives:
                    rep.warn("sw", k.path, "unexpected item in sw folder")
            if len(natives) != 1:
                rep.error("sw", d.path, f"expected one shared Resources folder, found {len(natives)}")
            resource_dirs["sw"] = natives[0] if natives else None
        else:
            versions[code] = d

    lesson_scans, lesson_dirs = {}, {}
    for v, d in versions.items():
        is_sw = v in SW_VERSIONS
        lessons, res = classify_version_folder(v, list_folder(d.id, d.path), rep, d.path, not is_sw)
        lesson_dirs[v] = lessons
        if not is_sw:
            resource_dirs[v] = res
        with cf.ThreadPoolExecutor(5) as ex:
            lesson_scans[v] = dict(zip(lessons, ex.map(lambda f, v=v: scan_lesson(v, f, rep), lessons.values())))

    # English is the reference. Sanity-check it on its own first.
    ref = lesson_scans.get("en")
    if ref is None:
        rep.error("en", "/", "no English version: cannot derive the expected structure")
        ref = {}
    total_ref = sum(len(s["videos"]) for s in ref.values())

    rows = {}
    for v in ["en", "fr", "es", "pt", "ar", "hi", "ur", "sw-KE", "sw-TZ"]:
        if v not in versions:
            continue
        stats = {}
        for n in range(5):
            if n in lesson_dirs[v]:
                stats[n] = check_lesson(v, n, lesson_dirs[v][n], lesson_scans[v][n],
                                        None if v == "en" else ref.get(n), rep)
            else:
                stats[n] = None
        # Folder names should be localised.
        if v != "en":
            for n, f in lesson_dirs[v].items():
                en_f = lesson_dirs["en"].get(n) if "en" in lesson_dirs else None
                if n > 0 and en_f and f.name == en_f.name:
                    rep.warn(v, f.path, "lesson folder name is identical to English")
        rows[v] = stats

    if not args.no_vtt:
        caps = [(v, n, num, e) for v, scans in lesson_scans.items() for n, s in scans.items()
                for num, es in s["caps"].items() for e in es]
        with cf.ThreadPoolExecutor(8) as ex:
            digests = list(ex.map(lambda t: check_vtt(t[0], t[3], rep), caps))
        bad_vtt, by_key = {}, {}
        for (v, n, num, e), d in zip(caps, digests):
            bad_vtt[v] = bad_vtt.get(v, 0) + (not d)
            if d:
                by_key[(v, n, num)] = (d, e)
        # A translated caption identical to the English one was probably never translated.
        for (v, n, num), (d, e) in sorted(by_key.items()):
            if v != "en" and by_key.get(("en", n, num), (None,))[0] == d:
                rep.warn(v, e.path, "caption is byte-identical to the English caption")
        same_sw = [k for k in by_key if k[0] == "sw-KE" and by_key.get(("sw-TZ",) + k[1:], (None,))[0] == by_key[k][0]]
        if same_sw:
            rep.info("sw-TZ", "sw-KE vs sw-TZ", f"{len(same_sw)} of {sum(1 for k in by_key if k[0] == 'sw-KE')} "
                                                "captions are identical between Kenya and Tanzania")
    else:
        bad_vtt = {}

    bad_mp4 = {}
    if not args.no_mp4:
        vids = [(v, n, num, es[0]) for v, scans in lesson_scans.items() for n, s in scans.items()
                for num, es in s["videos"].items()]

        def probe(t):
            v, _, _, e = t
            try:
                head, size = probe_head(e.id)
            except Exception as err:  # noqa: BLE001
                rep.error(v, e.path, f"video download failed: {err}")
                return None
            if head[4:8] != b"ftyp":
                rep.error(v, e.path, f"not an MP4 file (starts {head[:16]!r})")
                return None
            return size

        with cf.ThreadPoolExecutor(8) as ex:
            sizes = list(ex.map(probe, vids))
        by_key = {}
        for (v, n, num, e), size in zip(vids, sizes):
            bad_mp4[v] = bad_mp4.get(v, 0) + (size is None)
            if size:
                by_key[(v, n, num)] = (size, e)
        # Same byte size as the English video almost certainly means an untranslated copy.
        for (v, n, num), (size, e) in sorted(by_key.items()):
            if v != "en" and by_key.get(("en", n, num), (None,))[0] == size:
                rep.warn(v, e.path, f"video has the same size as the English one ({size} bytes)")
        same_sw = [k for k in by_key if k[0] == "sw-KE" and by_key.get(("sw-TZ",) + k[1:], (None,))[0] == by_key[k][0]]
        if same_sw:
            rep.info("sw-TZ", "sw-KE vs sw-TZ", f"{len(same_sw)} of {sum(1 for k in by_key if k[0] == 'sw-KE')} "
                                                "videos have identical sizes in Kenya and Tanzania")

    en_names = None
    res_results = {}
    order = ["en", "fr", "es", "pt", "ar", "hi", "ur", "sw"]
    for key in order:
        if key not in resource_dirs and key not in lang_dirs:
            continue
        r = check_resources(key, resource_dirs.get(key), rep, not args.no_pages, en_names)
        res_results[key] = r
        if key == "en":
            en_names = {n: e.name for n, e in r.get("slots", {}).items()}

    # ------------------------------------------------------------ output
    print(f"AI Literacy for Everyone - Drive completeness check (root {args.root})")
    print(f"English reference: {total_ref} videos; per lesson "
          + ", ".join(f"{'Intro' if n == 0 else 'L' + str(n)}={len(s['videos'])}v+{len(s['acts'])}a"
                      for n, s in sorted(ref.items())))
    print()
    hdr = ["version", "Intro", "L1", "L2", "L3", "L4", "videos", "bad mp4", "captions", "bad vtt",
           "masters", "TG pg", "WS pg", "WSx pg", "leftover", "errors", "warns"]
    table = []
    for v, stats in rows.items():
        cells = [v]
        tv = tc = 0
        for n in range(5):
            s = stats[n]
            if s is None:
                cells.append("--")
                continue
            exp = len(ref[n]["videos"]) if n in ref else "?"
            cells.append(f"{s['videos']}/{exp}")
            tv += s["videos"]
            tc += s["caps_ok"]
        cells.append(f"{tv}/{total_ref}")
        cells.append(str(bad_mp4.get(v, 0)) if not args.no_mp4 else "skip")
        cells.append(f"{tc}/{tv}")
        cells.append(str(bad_vtt.get(v, 0)) if not args.no_vtt else "skip")
        rk = "sw" if v in SW_VERSIONS else v
        r = res_results.get(rk, {"found": 0, "pages": {}, "leftovers": 0})
        cells.append(f"{r['found']}/4" + ("*" if rk == "sw" else ""))
        for n in (1, 2, 3):
            cells.append(str(r["pages"].get(n, "-")))
        cells.append(str(r["leftovers"]))
        errs = rep.count(v, "ERROR") + (rep.count("sw", "ERROR") if rk == "sw" else 0)
        warns = rep.count(v, "WARN") + (rep.count("sw", "WARN") if rk == "sw" else 0)
        cells += [str(errs), str(warns)]
        table.append(cells)
    widths = [max(len(str(r[i])) for r in [hdr] + table) for i in range(len(hdr))]
    print("  ".join(h.ljust(w) for h, w in zip(hdr, widths)))
    print("  ".join("-" * w for w in widths))
    for r in table:
        print("  ".join(c.ljust(w) for c, w in zip(r, widths)))
    print("(Lesson cells: videos found/expected. Page columns: exported PDF pages, expected 3/1/1."
          " * sw resources are shared by sw-KE and sw-TZ.)")

    print()
    print("Resources masters:")
    for key, r in res_results.items():
        names = " | ".join(f"{e.name}" for n, e in sorted(r.get("slots", {}).items()))
        print(f"  {key:5} {names or '(none)'}")

    for level in ("ERROR", "WARN", "INFO"):
        items = [i for i in rep.items if i[1] == level]
        if not items:
            continue
        print(f"\n{level}S ({len(items)})" if level != "INFO" else f"\nNOTES AND LEFTOVERS ({len(items)}, not a failure)")
        for v, _, path, msg in sorted(items, key=lambda i: (order.index(i[0].split('-')[0]) if i[0].split('-')[0] in order else -1, i[0], i[2])):
            print(f"  [{v}] {path}: {msg}")

    n_err = sum(1 for i in rep.items if i[1] == "ERROR")
    print(f"\nResult: {'FAIL' if n_err else 'OK'} - {n_err} errors, "
          f"{sum(1 for i in rep.items if i[1] == 'WARN')} warnings")
    return 1 if n_err else 0


if __name__ == "__main__":
    sys.exit(main())

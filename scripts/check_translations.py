#!/usr/bin/env python3
"""Check the course app text in course/translations/<lang>/<app>.json.

English is the reference. For every other language, each app file must have the
same keys, the same list lengths and the same {placeholder} tokens as English.
Quiz answers must still match one of the options. Exits 1 on any problem.

    python -I scripts/check_translations.py [course/translations]
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / "course" / "translations"
REF = "en"
PLACEHOLDER = re.compile(r"\{[A-Za-z_]+\}")


def shape(node, path=""):
    """Yield (path, kind) for every value, so two files can be compared key by key."""
    if isinstance(node, dict):
        for k, v in node.items():
            if k != "_note":
                yield from shape(v, f"{path}.{k}" if path else k)
    elif isinstance(node, list):
        yield path, f"list[{len(node)}]"
        for i, v in enumerate(node):
            yield from shape(v, f"{path}[{i}]")
    else:
        yield path, type(node).__name__


def strings(node, path=""):
    if isinstance(node, dict):
        for k, v in node.items():
            if k != "_note":
                yield from strings(v, f"{path}.{k}" if path else k)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            yield from strings(v, f"{path}[{i}]")
    elif isinstance(node, str):
        yield path, node


def check_answers(app, data):
    problems = []
    for i, q in enumerate(data.get("questions", [])):
        ans = q.get("correctAnswer")
        if app == "ai-or-not":
            if ans not in ("ai", "not_ai"):
                problems.append(f"questions[{i}].correctAnswer is {ans!r}, expected 'ai' or 'not_ai'")
        elif "options" in q and ans not in q["options"]:
            problems.append(f"questions[{i}].correctAnswer matches none of its options")
    return problems


def main():
    langs = sorted(p.name for p in ROOT.iterdir() if p.is_dir())
    apps = sorted(p.stem for p in (ROOT / REF).glob("*.json"))
    errors = 0
    for app in apps:
        ref = json.loads((ROOT / REF / f"{app}.json").read_text(encoding="utf-8"))
        ref_shape = dict(shape(ref))
        ref_strings = dict(strings(ref))
        line = []
        for lang in langs:
            f = ROOT / lang / f"{app}.json"
            if not f.exists():
                print(f"  {lang}/{app}.json: missing")
                errors += 1
                line.append(f"{lang}:missing")
                continue
            try:
                data = json.loads(f.read_text(encoding="utf-8"))
            except json.JSONDecodeError as e:
                print(f"  {lang}/{app}.json: not valid JSON ({e})")
                errors += 1
                line.append(f"{lang}:bad")
                continue
            problems = []
            got = dict(shape(data))
            for p in sorted(set(ref_shape) - set(got)):
                problems.append(f"missing {p}")
            for p in sorted(set(got) - set(ref_shape)):
                problems.append(f"extra {p}")
            for p in sorted(set(ref_shape) & set(got)):
                if ref_shape[p] != got[p]:
                    problems.append(f"{p} is {got[p]}, English has {ref_shape[p]}")
            for p, s in strings(data):
                if not s.strip():
                    problems.append(f"{p} is empty")
                if p in ref_strings and sorted(PLACEHOLDER.findall(s)) != sorted(PLACEHOLDER.findall(ref_strings[p])):
                    problems.append(f"{p} placeholders {PLACEHOLDER.findall(s)} differ from English {PLACEHOLDER.findall(ref_strings[p])}")
            problems += check_answers(app, data)
            same = 0 if lang == REF else sum(1 for p, s in strings(data) if ref_strings.get(p) == s and len(s) > 3)
            for msg in problems:
                print(f"  {lang}/{app}.json: {msg}")
            errors += len(problems)
            line.append(f"{lang}:{'ok' if not problems else len(problems)}" + (f"({same} same as en)" if same else ""))
        print(f"{app:<14} " + " ".join(line))
    print(f"\n{len(apps)} apps x {len(langs)} languages: {'OK' if not errors else f'{errors} problem(s)'}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

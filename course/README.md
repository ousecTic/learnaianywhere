# AI Literacy for Everyone: offline course packages

Everything here builds the downloadable course: one zip per language that people unzip
and open with **START HERE.html**, with no internet needed.

| What | Where |
| --- | --- |
| Lesson videos, captions, guides, worksheets and slides | Google Drive (the course folder in `settings.json`) |
| The course version, the languages and the NeuroPocket version | `settings.json` |
| The START HERE page | `player/` |
| The quizzes and the worksheet app | `apps/` |
| The words on the page and in the apps, per language | `translations/` |
| Links to the published zips, for the website | `downloads.json` (written by the release step) |

The build script is `scripts/build_course.py`. It writes into `build/course/`, which isn't saved in git.

## Release a new version

Do this when you've changed something in Drive (a video, a caption, a document) or in this
folder, and want people to get it.

1. **Choose the new version number.** In `settings.json`, change `"version"` under `"course"`,
   for example from `"1.0"` to `"1.1"`. Every version gets its own release, so links to older
   versions keep working.

2. **Build everything** from the repository folder:

   ```
   python -I scripts/build_course.py all
   ```

   This exports the documents from Drive, shrinks the PDFs, downloads the videos and captions
   (only the ones that changed since last time), puts each language's package together and
   zips it. It takes a few minutes. If something is wrong in Drive, such as a missing caption,
   it stops and says what.

3. **Check the packages.** Open `build/course/packages/<language>/<folder>/START HERE.html`
   (for example the English and Urdu ones) and click through a lesson.

4. **Upload them as a draft:**

   ```
   python -I scripts/build_course.py release
   ```

   The draft is only visible to you, under Releases on GitHub. Look it over there.

5. **Publish:**

   ```
   python -I scripts/build_course.py release --publish
   ```

   Anyone can now download the zips. This also updates `downloads.json` with the new links,
   and puts it on the `course-latest` release, where installed copies of the Android app
   (`app/`) look for new course versions.

6. **Commit** `settings.json` and `downloads.json`, so the website points at the new version.

## Other changes

- **A newer NeuroPocket:** in `settings.json`, change `"version"` and `"sha256"` under
  `"neuropocket"` (the fingerprint of that release's `neuropocket-offline.html`), then release a
  new version as above. The build stops if the downloaded file doesn't match the fingerprint.
- **A new language:** add its folder in Drive (named with its code first, like `"ur — Urdu (اردو)"`),
  its text files in `translations/<code>/`, its entry in `translations/languages.json` and a line
  under `"packages"` in `settings.json`.
- **Only some languages:** add `--package ur` (repeat for more) to `all`.
- **Changed text in `translations/`:** run `python -I scripts/check_translations.py` first.

## What you need on the computer

- [Python 3](https://www.python.org) with PyMuPDF and Pillow: `pip install pymupdf pillow`
- [Node.js](https://nodejs.org) 18 or newer (it builds the apps)
- The [GitHub CLI](https://cli.github.com), signed in with `gh auth login`, for the release step

# Android: one app per language, with the course inside

Plan written 2 November 2026 on the `redesign` branch. Analysis only: nothing in the app,
the build or the website has been changed yet.

## The recommendation

Build **nine APKs, one per language package**, each with that language's whole course
inside. A teacher downloads one file once (116 to 197 MB), installs it, and can then pass
it to any other phone with ShareIt, Xender, Files by Google or Bluetooth. The receiving
phone needs no internet at all.

- **The course is read straight from inside the APK.** Nothing is unpacked or copied, so
  the phone stores the course once, not twice. The app we have already serves its own
  screens this way. We point the same mechanism at the course.
- **Give each language its own app id** (`org.learnaianywhere.ailiteracy.fr` and so on),
  signed with the key the app already uses. Two languages can then sit side by side on one
  phone, and each language updates on its own.
- **Leave the current small app alone.** The people who already have it keep a working
  course, and it keeps getting course updates from `course-latest` as it does today. The
  website stops offering it and offers the language APK instead.
- **Let GitHub build the nine APKs**, the way it builds the current app now. It takes the
  published course ZIPs, checks their fingerprints, puts each one into an APK and signs it.
  You push one tag after each course release.

### Can the course load and play straight from the APK? Yes, with one small fix

- **Pages and links work as they are.** START HERE.html, `neuropocket.html` and `content/`
  only point at each other with relative paths (`content/lesson-1/02.mp4`,
  `content/apps/ai-or-not/index.html?…`, `neuropocket.html?lang=fr`,
  `content/resources/1-teacher-guide.pdf`). Every name in `content/` is plain ASCII.
  Capacitor already serves files from the APK at `https://localhost/…`: that is how the
  setup screens in `assets/public/` load today. Captions are built into the page and
  turned into a file in memory (`course/player/index.html:712-725`), so there are no
  separate caption files to find. NeuroPocket is one self-contained 15 MB file.
- **Progress is kept.** Progress lives in `localStorage` (`course/player/index.html:486-497`)
  and NeuroPocket uses `localStorage` and IndexedDB. All of these belong to the page's
  origin, `https://localhost` inside this one app. They survive closing the app and
  installing a newer APK of the same app. They are lost only if someone uninstalls the app
  or taps "Clear storage". Today's app works the same way.
- **The fix: jumping around in a video.** When you drag a video's slider, the WebView
  asks for "the bytes from position N onwards". This is called a range request.
  Capacitor 6.2 answers it with the right headers but sends the file from the beginning
  anyway (`node_modules/@capacitor/android/.../WebViewLocalServer.java:320-347`: it never
  skips to N). Today's app serves the unpacked course through that same code, so
  **dragging the slider may already misbehave in the app you have**. Please test this
  first (step 0 below). Either way, the new app should answer video requests itself:
  about 40 lines of Java in `MainActivity` that open the video inside the APK, jump to
  byte N and send just that part. For this to work the videos must be stored
  uncompressed inside the APK. `.mp4` files are stored that way by default, and we will
  say so explicitly in `build.gradle`. AndroidX's `WebViewAssetLoader` has the same gap
  and doesn't help.
- **PDFs need one change.** The PDF viewer is another app, and today we hand it a file
  path (`CoursePackPlugin.java:242-268`). A PDF inside the APK has no file path, so on tap
  the app copies that one PDF (7 MB at most) to its cache and hands that copy over.

**Fallback, if reading from the APK fails on some phones:** unpack the course into the
app's storage the first time it opens, then run exactly as today. This costs storage
twice over: Android always keeps the APK, so the phone holds the course in the APK and
again in the copy, about 240 to 400 MB. The first launch also takes a minute or two. Use
this only if testing shows we need it.

## 1. How the app works today

The app is a 3 MB Capacitor app: a WebView plus one plugin of our own, `CoursePack`.

1. **First open.** `www/index.html` reads the course list built into the APK
   (`downloads.json`, copied in by `course/app/scripts/prepare-www.mjs`) and asks the
   plugin what is installed (`www/index.html:489-509`). With nothing installed, it shows
   the language list (`showLangs`, line 302).
2. **Download.** Tapping a language calls `download` (`CoursePackPlugin.java:103-141`).
   That checks there's room for 2.2 times the ZIP (lines 56, 327-329). It then downloads
   to `files/downloads/<id>-v<version>.zip.part`. If the connection drops, it picks up
   where it stopped using range requests to GitHub, up to 5 times (lines 360-397).
3. **Verify.** It computes the ZIP's SHA-256 and compares it with `downloads.json`, and
   deletes the ZIP if they differ (lines 336-341).
4. **Unzip.** It unpacks into `files/courses/<id>-v<version>.tmp/` and drops the ZIP's top
   folder ("AI Literacy for Everyone - English/"), lines 399-427, especially 409. It copies
   START HERE.html to `index.html`, renames the folder into place, deletes the ZIP and
   any older course, and remembers the folder (lines 343-357).
5. **Open.** `openCourse` (lines 222-231) points Capacitor's server at that folder
   (`setServerBasePath`). The course page then loads as `https://localhost/index.html`.
6. **Inside the course** (`course/player/index.html:450-470`), the page notices it's in
   the app. "App settings" calls `openShell` (lines 234-239), which points the server back
   at the setup screens in the APK. PDF links call `openFile` (lines 242-268), which hands
   the PDF to the phone's PDF viewer.
7. **Updates.** On every launch the plugin quietly fetches `course-latest/downloads.json`
   and `app-latest/app.json` (lines 68-70, 273-288; addresses in `capacitor.config.json`).
   The setup screen waits up to 2.5 s and offers a newer course or app if there is one.
   A newer app is downloaded, checked and handed to Android's installer (`installApp`,
   lines 164-212).

Storage today: about 2.2 times the ZIP while installing, then once the ZIP's size.

## 2. How the course goes inside the APK

- **Where the course goes.** The build puts the unpacked package (the ZIP's top folder,
  dropped as today) into an extra assets folder for that language. Android merges it into
  `assets/public/` next to the setup screens. START HERE.html becomes the app's start page,
  and the setup screens move to their own page (say `app.html`). "App settings" then goes
  there instead.
- **Reading from the APK.** Capacitor serves everything from the APK. Our own small
  handler answers video range requests (see above).
- **What the plugin keeps and drops.** Downloading, verifying and unzipping the course go
  away. The plugin keeps `openFile` (copying the PDF to the cache first) and, if you want
  it, the update check and `installApp`.
- **Settings screen.** It shows the language, the course version and "Check for updates".
  There's no language list: another language is another app, and the screen says where to
  get it.
- **Leftovers.** On first launch the app deletes any `files/courses/` folder. A brand-new
  app id never has one, but this is cheap insurance.

## 3. Sizes and limits

| Package | v1.5 ZIP | APK (estimate: ZIP + about 4 MB of app) |
| --- | --- | --- |
| en | 116 MB | about 120 MB |
| fr, es, pt, ar, hi, sw-KE, sw-TZ | 178 to 183 MB | about 182 to 187 MB |
| ur | 197 MB | about 201 MB |

- **APK size.** Android has no size limit for APKs installed outside the Play Store. The
  Play Store limit doesn't apply to us. Files above 2 GB cause trouble, and we're far
  below that.
- **Space on the phone.** While installing, the phone holds the received `.apk` file and
  the installed copy, so it needs about twice the APK size free (240 to 400 MB). Once
  installed, the received file can be deleted, leaving the course stored once. That's the
  same as today and less than the 2.2 times today's download needs. A teacher who shares
  through ShareIt or Xender doesn't need to keep the file: those apps send the installed
  app itself. Files by Google and Bluetooth send a file, so the sender keeps the `.apk`.
- **GitHub.** Each release file may be up to 2 GiB, and a release has no overall limit.
  Nine APKs come to about 1.6 GB per version. That's fine on a public repository, but each
  new version adds another 1.6 GB.
- **Sideloading prompts.** These are the same as today: "Install unknown apps" once for
  each app that opens the file (Chrome, ShareIt, Files…), and possibly a Play Protect
  warning. A large unknown app may also get Play Protect's "scan this app?" question,
  which is skipped offline.
- **Android versions.** The app supports Android 5.1 and newer (`minSdkVersion 22`,
  `course/app/android/variables.gradle:2`) and targets Android 14 (SDK 34). Reading from
  the APK works on all of these.
- **Bluetooth.** About 20 to 40 minutes for 180 MB. Some phones refuse to send or receive
  `.apk` files over Bluetooth.

## 4. Build and release changes

**Today.** `.github/workflows/app-release.yml` builds the small app when you push a tag
like `app-v1.0.0`. The version is in the tag (lines 31-44), a published version can't be
published again (lines 46-53), and signing uses the permanent key `ailiteracy-release.jks`
from four repository secrets (lines 82-99, `build.gradle:23-33`). It then puts
`ai-literacy.apk` and `app.json` on `app-latest` (lines 136-146). Course ZIPs are built on
your PC by `scripts/build_course.py all`. `release --publish` uploads them to
`course-v<version>`, refuses an already-published version (lines 880-883), and updates
`course-latest/downloads.json` (lines 911-921).

**Proposed.**

- **A new workflow, `.github/workflows/apk-release.yml`, triggered by a tag like
  `apk-v1.5.0`.** The first two numbers must match the course version in
  `course/downloads.json`. The last is the app's own revision, for app-only fixes. It runs:
  1. A first job checks the tag, refuses an already-published version, and creates a
     draft release `apk-v1.5.0`.
  2. Nine parallel jobs, one per language. Each downloads that language's ZIP from the
     published course release, checks its SHA-256 against `course/downloads.json`,
     unpacks it, and builds with `./gradlew assembleRelease -PcoursePackage=fr`. It signs
     with the same key as today, checks the signature and uploads
     `ai-literacy-fr-1.5.0.apk` to the draft.
  3. A last job writes `apps.json` (one line per language: versionCode, url, sha256,
     bytes). If the tag has no `-test` ending, it publishes the release and copies each
     APK as `ai-literacy-<id>.apk`, plus `apps.json`, onto a fixed-address release,
     `apk-latest`.

  Separate jobs keep each runner's disk small: one language at a time is about 1 GB.
- **`build.gradle`.** It reads `coursePackage` and sets the app id, the name on the home
  screen and the extra assets folder. It also lists `mp4` and `pdf` as "don't compress".
- **Your PC.** `build_course.py` needs no APK step. The course ZIPs stay the one source,
  and the PC never needs the Android tools or the key. Add one small command, say
  `build_course.py apps`, that reads `apk-latest/apps.json` and writes `course/apps.json`.
  The website gets its APK sizes from that file, the same way `links` fills in
  `downloads.json`.
- **Version numbers.** versionName is `1.5.0`. versionCode is course major × 10000 +
  course minor × 100 + revision, so 10500. It always goes up, and course 1.6 (10600) beats
  any app-only fix to 1.5. This is the same formula as today's workflow.
- **The order for every course release:**
  1. `build_course.py all`
  2. `release --publish`
  3. push the tag `apk-v<course version>.0`
  4. `build_course.py apps`, then commit.
- **Signing.** Use one key for all nine apps. Android allows this, and there's only one
  key to protect. Losing it still means no app can ever be updated again, so keep the two
  backups.

**One app id or nine?**

| | One id for all languages | One id per language (recommended) |
| --- | --- | --- |
| Two languages on one phone | No: installing French replaces English, progress included | Yes, two icons |
| Updates | Every language must share one version number, and a phone can be "updated" into another language by accident | Each language updates on its own |
| Existing small-app users | Installing any language APK replaces their app | Their app is untouched; the new one is a second icon until they uninstall the old one |
| Progress from the small app | Kept (same app) | Not carried over; learners start ticking again |

## 5. People who already have the small app

- **The small app keeps working.** Same course, same offline use. It keeps checking
  `course-latest/downloads.json`, so **keep publishing that file** with every course
  release (`release --publish` already does). It will keep offering each new course version.
- **`app-latest` and `app-v1.0.0`.** Leave them as they are: don't delete them, and don't
  publish more small-app versions. Old links to `app-latest/ai-literacy.apk`, from guides
  or messages, keep working.
- **Optional:** one last small-app version (1.1.0) with a line in its settings: "A version
  with the course inside, for sharing without internet, is on learnaianywhere.org." It
  isn't needed.
- **Moving across.** People who install a language APK next to the small app get a second
  icon. They should uninstall the old one to free its 120 to 200 MB. Progress doesn't move
  across.

## 6. Website changes

- **`src/pages/AILiteracyForEveryone.jsx`, Android plan** (lines 25-26, 186-187):
  - `APP_URL` becomes the link for the chosen language,
    `…/releases/download/apk-latest/ai-literacy-${pkg.id}.apk`.
  - `APP_MB` becomes that language's size from `course/apps.json`.
  - The button reads "Download the app · 182 MB".
  - The text becomes something like: "Download it once, on Wi-Fi: the whole {lang} course
    is inside. Then share it phone to phone with ShareIt, Xender or Files by Google; the
    other phones need no internet."
  - Drop "choose {lang}".
- **`src/pages/AndroidInstallSteps.jsx`** (`APP_URL` line 17, steps lines 19-36):
  - Steps 1 to 6 still hold, but the pictures show `ai-literacy.apk` and "AI Literacy".
    Re-shoot pictures 1, 2, 5 and 6 with the new file and app name, and say that
    installing takes a little longer.
  - Steps 7 (choose a language) and 8 (download) go. Replace them with one step, "The
    course opens", with a new picture.
  - Add a short "Share it with another phone" part: ShareIt or Xender (pick the app), Files
    by Google (send the `.apk`). Say that on the receiving phone, Android asks to allow
    installs from that app once: same screens as pictures 3 and 4.
  - Keep the 432 × 936 picture size.
- **Elsewhere.** The teacher guide masters on Drive describe the app's language download
  and "120 to 200 MB". Update them when this ships.

## 7. Order of work, with what you test on a phone

0. **Now, on the app you have:** open a long video (Lesson 3) and drag the slider to the
   middle. Does it jump there and play? Then do the same with Wi-Fi off. This tells us
   whether today's app has the seeking problem too.
1. **Prototype, English only, a test APK built on a PC.** Course in the APK, our own video
   handler, PDFs copied to the cache, settings page.
   *Test:* install with Wi-Fi off. Play videos, drag the slider, captions on and off,
   AI or Not, a recap quiz, a worksheet, NeuroPocket with the camera, each PDF. Close the
   app and reopen it: ticks still there.
2. **Same for Arabic.** *Test:* right to left, Arabic text in the quizzes.
3. **Size and space.** *Test:* note the APK size and the time to install. In Settings →
   Apps, note the storage used: it should be about the APK size, not twice.
4. **Sharing.** *Test:* from your phone to a second phone with no SIM and no Wi-Fi, using
   ShareIt or Xender, then Files by Google, then Bluetooth. Then pass it on from the
   second phone to a third. If you can find one, try an old phone (Android 7 or older)
   with little free space.
5. **Updates and side by side.** Build 1.5.0 and 1.5.1. *Test:* install 1.5.1 over 1.5.0
   (received by sharing): progress kept. Install French next to English: two icons, two
   sets of progress. Install 1.5.0 over 1.5.1: Android refuses. Then check the message.
6. **The workflow.** Push `apk-v1.5.0-test`, which makes a draft. *Test:* download three
   or four APKs from the draft and check each opens in its own language with the right
   name on the home screen.
7. **Publish** `apk-v1.5.0`, run `build_course.py apps`, change the website and take the
   new pictures. *Test:* the install page on your phone, start to finish, in two languages.
8. **Next course release.** *Test:* the old small app still offers the new course, and
   the new APKs arrive as `apk-v1.6.0`.

## Risks and open questions

- **Seeking.** If our own video handler misbehaves on some WebView versions, the fallback
  is unpacking, at twice the storage. Step 0 and an old phone in step 4 tell us early.
- **Google's developer verification.** Google announced that from 2026 phones with Google
  Play will only install apps, sideloaded ones included, from developers registered with
  Google. It starts in a few countries and goes worldwide in 2027. This affects the current
  app too. Check the current rules and register the app ids and signing key before it
  reaches your learners' countries. If you can't register, sideloading this app will stop
  working on most Android phones.
- **Big updates.** Every course fix means nine new 120 to 200 MB files, and teachers have
  to pass them on again. Old versions will keep circulating, which is harmless, but show
  the course version in the app so a teacher can tell which one they have. In-app updates
  briefly need room for the old app, the new APK and its install: about three times the
  size.
- **Space.** Phones need roughly twice the APK size free while installing, which may be
  too much for some phones with 8 or 16 GB of storage.
- **Bluetooth.** Slow, and some phones block `.apk` files. ShareIt, Xender and Files by
  Google are the realistic ways.
- **Progress doesn't carry over** from the small app (with one app id per language).
- **Play Protect** may warn more about a large unknown app. That's not something we can
  fix without the Play Store.
- **GitHub storage** grows by about 1.6 GB per course version. That's fine for now; old
  `apk-v*` drafts can be deleted, but published ones stay.

## What you need to decide

1. **App ids:** one id per language (recommended) or one id for all.
2. **Home-screen name** per language, for example "AI Literacy (Français)". Phones cut
   names at about 12 characters, so maybe "AI Literacy FR".
3. **In-app update check:** keep it (it offers the newer APK when online), or drop it and
   rely on teachers and the website.
4. **The small app:** leave it frozen (recommended), or publish a last version with a
   pointer to the new apps.
5. **Oldest Android:** keep Android 5.1 as the minimum, or raise it.
6. **Developer verification:** whether to register with Google, and under which name.

# AI Literacy for Everyone: Android app

A small Android app (Capacitor) that puts the offline course on a phone. On first open it
asks for a language, downloads that language's package (the same zip the website offers,
from the course release in `../downloads.json`), checks its fingerprint, unzips it and opens
its START HERE page. After that it works without internet.

| What | Where |
| --- | --- |
| Language picker, download and settings screens | `www/index.html` |
| Download, fingerprint check, unzip, opening the course and PDFs | `android/app/src/main/java/org/learnaianywhere/ailiteracy/CoursePackPlugin.java` |
| App ID, name | `capacitor.config.json` (`org.learnaianywhere.ailiteracy`, "AI Literacy") |

The course page itself (`../player`) notices when it runs inside the app: it adds an
"App settings" link (to change language) and opens PDFs in the phone's PDF viewer.

## Updates

There's no app store, so the app updates itself. Each time it opens it checks, in the
background, the two addresses in `capacitor.config.json`:

- `course-latest/downloads.json`: written by `scripts/build_course.py release --publish`.
  A newer course version than the installed one is offered on an Updates screen, and
  downloaded like the first one; the installed version keeps working until it's ready.
- `app-latest/app.json`: the newest APK (`versionCode`, `versionName`, `url`, `sha256`,
  `bytes`). A higher `versionCode` than the installed app's is offered too; the app downloads
  and checks the APK, then Android's installer takes over.

The check waits at most 2.5 seconds before opening the course (offline it fails at once).
"Not now" hides an update until a newer one appears; App settings has "Check for updates".

## Apps with the course inside

The same project also builds one app per language package, with that language's whole
course inside the APK, so it can be shared phone to phone (ShareIt, Xender, Files by
Google) and the other phone needs no internet. These are what the website offers once
they are published; the small app above stays as it is for the people who have it.

| What | Where |
| --- | --- |
| Which app is built | `-PcoursePackage=<id>` (`en`, `fr`, ..., `sw-KE`), read in `android/app/build.gradle` |
| App ID, home-screen name | `org.learnaianywhere.ailiteracy.<id>` (`-` becomes `_`), "AI Literacy EN" (the language code; both Swahili apps are "AI Literacy SW") |
| Version | `-PappVersionName=1.5.0 -PappVersionCode=10500`; by default the course version plus `.0` |
| The course | `-PcourseZip=<package zip>`, by default `build/course/zips/<file>` as `scripts/build_course.py` makes it; unpacked without its top folder into the APK's assets |
| Settings page (language, version, updates, sharing, other languages) | `bundled/app.html`, opened by "App settings" in the course |
| Opening PDFs, update check, `openCourse` / `openShell` | `CoursePackPlugin.java`, when `BuildConfig.COURSE_PACKAGE` isn't empty |

How it works on the phone: START HERE.html is the app's start page (copied to `index.html`),
and Capacitor serves the course straight from the APK, so it's stored once. Videos and PDFs
are stored uncompressed (`noCompress`); when you drag a video's slider the WebView asks for
"the bytes from N on" and skips to N itself in what Capacitor sends, which is a jump for an
uncompressed file. A PDF is copied to the app's cache before the phone's PDF viewer gets it.
Progress is in the page's `localStorage`, which an update of the same app keeps.

Updates: when the app opens it reads `apk-latest/apps.json` (`appsLatestUrl` in
`capacitor.config.json`). If that lists a higher `versionCode` for this language within 3
seconds, the update screen opens; "Not now" stops offering that version. App settings has
"Check for updates" too.

Build a test APK (debug, signed with a throwaway key):

```
npm install
npm run sync
cd android
./gradlew assembleDebug -PcoursePackage=en -PcourseZip=<path to ai-literacy-for-everyone-en-v1.5.zip>
```

Release: push a tag `apk-v<course version>.<revision>`, for example `apk-v1.5.0` after
course 1.5 is published (`apk-v1.5.0-test` makes a draft only). GitHub
(`.github/workflows/apk-release.yml`) downloads each package ZIP from the course release,
checks its SHA-256 against `course/downloads.json`, builds and signs the nine APKs with the
same key as the small app, and publishes `ai-literacy-<id>-1.5.0.apk` on `apk-v1.5.0`, plus
`ai-literacy-<id>.apk` and `apps.json` on `apk-latest`. Then run
`python -I scripts/build_course.py apps` and commit `course/apps.json`: the website switches
to the language apps when that file exists. A published `apk-v*` version can't be published
again; tag a higher revision for an app-only fix.

## Icon

The icon is made from `resources/` (the LAIA logo; the foreground fits inside a round mask).
After changing those pictures, regenerate the Android icons with
`npx capacitor-assets generate --android`.

## Storage

On the phone the course lives in the app's own storage, in `courses/<package>-v<version>/`,
with an `index.html` copy of START HERE. Only one language is kept at a time; changing
language downloads the new one first and keeps the old one until it's ready.

## Build a test APK

Needs Node.js, JDK 17 and the Android SDK (`ANDROID_HOME`).

```
npm install
npm run sync
cd android
./gradlew assembleDebug
```

The APK is `android/app/build/outputs/apk/debug/app-debug.apk`. Debug builds are signed with
a throwaway key: uninstall them before installing a release build.

## Release the app

GitHub builds and signs the APK (`.github/workflows/app-release.yml`) when you push a tag:

```
git tag app-v1.0.0
git push origin app-v1.0.0
```

- `app-v1.0.0` publishes the release `app-v1.0.0` with `ai-literacy-1.0.0.apk`, and puts a
  copy named `ai-literacy.apk` plus `app.json` on the `app-latest` release. Installed apps
  find the new version there; the website can always link to
  `releases/download/app-latest/ai-literacy.apk`.
- `app-v1.0.0-test` (anything after the version) makes a draft release only, to check
  before publishing. Delete the draft and the tag afterwards.

Each version can be published once: tag a higher version for every change. The tag's version
becomes the APK's version name, and its version code is major × 10000 + minor × 100 + patch.

Every release is signed with the app's one permanent key, `ailiteracy-release.jks` (alias
`ailiteracy`), kept in four repository secrets: `ANDROID_KEYSTORE_BASE64`,
`ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_PASSWORD` and `ANDROID_KEY_ALIAS`. Android only
installs an update signed with the same key as the installed app, so never lose or replace
it: keep the file and its password backed up in two safe places. To sign locally, set
`APP_KEYSTORE_FILE`, `APP_KEYSTORE_PASSWORD`, `APP_KEY_ALIAS` and `APP_KEY_PASSWORD`, then
run `./gradlew assembleRelease` in `android/`.

`npm run sync` copies `../downloads.json`, the logo and the font into `www/`, then copies
`www/` into the Android project.

To try the setup screens without a phone, serve `www/` (the `app-shell` preview in
`.claude/launch.json`): in a browser they use a stand-in that pretends to download.

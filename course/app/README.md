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

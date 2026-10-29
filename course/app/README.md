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

`npm run sync` copies `../downloads.json`, the logo and the font into `www/`, then copies
`www/` into the Android project.

To try the setup screens without a phone, serve `www/` (the `app-shell` preview in
`.claude/launch.json`): in a browser they use a stand-in that pretends to download.

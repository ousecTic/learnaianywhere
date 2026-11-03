// The Android apps with one language's course inside: course/apps.json, which
// `scripts/build_course.py apps` writes once an apk-v* release is published (see
// course/app/README.md). Until that file exists the course page and the install steps
// offer the small app that downloads the course, as before. import.meta.glob finds no
// file instead of failing the build, so this can ship before the apps do.
const found = import.meta.glob('../../course/apps.json', { eager: true, import: 'default' });
const apps = Object.values(found)[0] || null;

// The small app: downloads a language on the phone. Kept working for people who have it.
export const SMALL_APP_URL = 'https://github.com/ousecTic/learnaianywhere/releases/download/app-latest/ai-literacy.apk';
export const SMALL_APP_MB = 3;

export const hasLanguageApps = !!(apps && apps.apps && apps.apps.length);

// One language's app ({ id, latestUrl, bytes, ... }), or null before the apps are published.
export const languageApp = (packageId) => (hasLanguageApps && apps.apps.find((a) => a.id === packageId)) || null;

// The name on the phone's home screen, as course/app/android/app/build.gradle sets it.
export const appLabel = (packageId) => `AI Literacy ${packageId.split('-')[0].toUpperCase()}`;

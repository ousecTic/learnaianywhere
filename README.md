# Learn AI Anywhere

Source code for [learnaianywhere.org](https://learnaianywhere.org), offline-first AI literacy lessons. The site is a React app built with [Vite](https://vite.dev).

Its main course is **AI Literacy for Everyone**, a free teaching kit in 8 languages, at
[`/courses/ai-literacy-for-everyone`](src/pages/AILiteracyForEveryone.jsx). Teachers get it as a zip for a
computer, an Android app, an online version or single files. The course itself is built separately from this site, from
Google Drive: see [`course/README.md`](course/README.md).

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install       # install dependencies
npm run dev       # start a dev server at http://localhost:5173
npm run build     # build the site into dist/
npm run preview   # serve the built site at http://localhost:4173
npm run lint      # check the code
```

`dev` and `build` first run `build:apps`, which puts the course's quiz and worksheet apps and the online kit into
`public/course/` (not saved in git). It downloads the pinned NeuroPocket release once, into `build/`. The online kit's
pages don't open in the dev server, which rewrites HTML pages; try them with `npm run build` and `npm run preview`.

## Where things are

| What | Where |
| --- | --- |
| Pages and components | `src/` |
| The course page and the Android install steps | `src/pages/AILiteracyForEveryone.jsx`, `src/pages/AndroidInstallSteps.jsx` |
| Course downloads the page reads (zip links, sizes, Drive files) | `course/downloads.json` |
| The online kit | `course/online/`, copied into the site by `scripts/build-online.mjs` |
| The course apps and their text in each language | `course/apps/`, `course/translations/` |
| The course build, releases and the Android app | `scripts/build_course.py`, `course/app/`; see `course/README.md` |
| Redirects | `public/_redirects` |

The zips, the app and the online kit's videos are on [GitHub Releases](https://github.com/ousecTic/learnaianywhere/releases),
not in git.

## Deployment

[Netlify](https://www.netlify.com) builds and publishes the `master` branch, so **anything merged into `master` goes live**.
Other branches get a private preview link from Netlify, for checking changes first.

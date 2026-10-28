# Learn AI Anywhere

Source code for [learnaianywhere.org](https://learnaianywhere.org), offline-first AI literacy lessons. The site is a React app built with [Vite](https://vite.dev).

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install       # install dependencies
npm run dev       # start a dev server at http://localhost:5173
npm run build     # build the site into dist/
npm run lint      # check the code
```

## Deployment

[Netlify](https://www.netlify.com) builds and publishes the `master` branch, so **anything merged into `master` goes live**. Redirects are in [`public/_redirects`](public/_redirects).

The course rebuild is happening on the `redesign` branch and merges into `master` at launch. This README will be rewritten then.

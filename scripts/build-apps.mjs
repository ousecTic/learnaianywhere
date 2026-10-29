// Builds the course mini-apps into self-contained pages that work offline (file://).
//
// Each app's source page is course/apps/<app>/index.html. It contains the marker
// /*COURSE_TEXT*/null, which is replaced with that app's text from
// course/translations/<lang>/*.json plus the language list. Output:
//
//   dist-course/apps/recap-quiz/index.html   (all 4 recap quizzes; ?quiz=1-4&lang=xx)
//   dist-course/apps/ai-or-not/index.html    (+ images/; ?lang=xx)
//
// Any other files in an app's source folder (such as images/) are copied next to its page.
//
// Usage: node scripts/build-apps.mjs [--out <dir>]

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, cpSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outIndex = process.argv.indexOf('--out');
const outDir = resolve(outIndex === -1 ? join(root, 'dist-course') : process.argv[outIndex + 1]);
const translations = join(root, 'course', 'translations');
const MARKER = '/*COURSE_TEXT*/null';

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const languages = readJson(join(translations, 'languages.json'));

// Text for one translation file name (e.g. "recap-quiz-2"), keyed by language code.
// The "_note" key is guidance for translators and is left out of the built page.
function textFor(name) {
  const byLang = {};
  for (const { code } of languages) {
    const file = join(translations, code, `${name}.json`);
    if (!existsSync(file)) {
      if (code === 'en') throw new Error(`Missing English text: ${file}`);
      continue;
    }
    const { _note, ...text } = readJson(file);
    byLang[code] = text;
  }
  return byLang;
}

// JSON that is safe inside a <script> element: no "</script>", no raw line separators.
const LT = /</g, LS = new RegExp(String.fromCharCode(0x2028), 'g'), PS = new RegExp(String.fromCharCode(0x2029), 'g');
const scriptJson = (value) =>
  JSON.stringify(value).replace(LT, '\\u003c').replace(LS, '\\u2028').replace(PS, '\\u2029');

function build(app, courseText) {
  const srcDir = join(root, 'course', 'apps', app);
  const source = readFileSync(join(srcDir, 'index.html'), 'utf8');
  if (source.split(MARKER).length !== 2) throw new Error(`${app}: expected the ${MARKER} marker exactly once`);
  const page = source.replace(MARKER, () => scriptJson(courseText));
  const dest = join(outDir, 'apps', app);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  writeFileSync(join(dest, 'index.html'), page);
  const extras = readdirSync(srcDir).filter((f) => f !== 'index.html');
  for (const f of extras) cpSync(join(srcDir, f), join(dest, f), { recursive: true });
  console.log(`${app}: ${join(dest, 'index.html')} (${Math.round(page.length / 1024)} KB)` +
    (extras.length ? ` + ${extras.join(', ')}` : ''));
}

const recapQuizzes = readdirSync(join(translations, 'en'))
  .map((f) => /^recap-quiz-(\d+)\.json$/.exec(f))
  .filter(Boolean)
  .map((m) => m[1])
  .sort((a, b) => a - b);
const quizzes = {};
for (const n of recapQuizzes) quizzes[n] = textFor(`recap-quiz-${n}`);
build('recap-quiz', { languages, quizzes });
build('ai-or-not', { languages, text: textFor('ai-or-not') });

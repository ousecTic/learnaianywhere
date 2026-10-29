// Copies what the setup screens need from the rest of the course folder into www/:
// the release list (so a fresh install knows which language packages exist and where to
// download them before it has ever been online), and the logo and font the course page
// uses. Run by `npm run sync`.
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = join(dirname(fileURLToPath(import.meta.url)), '..');
const course = join(app, '..');
const www = join(app, 'www');
mkdirSync(www, { recursive: true });
const copies = [
  ['downloads.json', 'downloads.json'],
  ['player/assets/learn-ai-anywhere-logo.png', 'logo.png'],
  ['player/assets/inter-latin.woff2', 'inter-latin.woff2'],
];
for (const [from, to] of copies) {
  copyFileSync(join(course, from), join(www, to));
  console.log(`Copied course/${from} to www/${to}`);
}

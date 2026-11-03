// Puts the online kit into the website: course/online/<package>/index.html (written by
// scripts/build_course.py online) is copied to <out>/online/<package>/, and the pinned
// NeuroPocket from course/settings.json is downloaded to <out>/online/neuropocket.html,
// where the online pages open it. The download is checked against its fingerprint and
// kept in build/ between runs, so it's only fetched again for a new NeuroPocket version.
//
// Usage: node scripts/build-online.mjs [--out <dir>]

import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outIndex = process.argv.indexOf('--out');
const outDir = join(resolve(outIndex === -1 ? join(root, 'public', 'course') : process.argv[outIndex + 1]), 'online');
const source = join(root, 'course', 'online');
const { neuropocket: np } = JSON.parse(readFileSync(join(root, 'course', 'settings.json'), 'utf8'));

const sha256 = (data) => createHash('sha256').update(data).digest('hex');

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
if (existsSync(source)) cpSync(source, outDir, { recursive: true });

const cache = join(root, 'build', `neuropocket-${np.version}.html`);
let data = existsSync(cache) ? readFileSync(cache) : null;
if (!data || sha256(data) !== np.sha256) {
  const url = `https://github.com/ousecTic/neuropocket/releases/download/v${np.version}/${np.file}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NeuroPocket ${np.version}: ${res.status} from ${url}`);
  data = Buffer.from(await res.arrayBuffer());
  if (sha256(data) !== np.sha256) throw new Error(`NeuroPocket ${np.version}: the download doesn't match the sha256 in course/settings.json`);
  mkdirSync(dirname(cache), { recursive: true });
  writeFileSync(cache, data);
}
writeFileSync(join(outDir, 'neuropocket.html'), data);
console.log(`online kit -> ${outDir} (NeuroPocket ${np.version})`);

// Draws the "Our global reach" map on the home page from the list of countries
// in src/data/learner-countries.json, and writes it as an SVG to
// src/assets/images/about/world-map.svg.
//
//   node scripts/build-map.mjs
//
// Edit the list, run this, and commit both files. The home page shows the
// number of countries from the same list, so the text and the map always agree.
// Country shapes come from Natural Earth (the world-atlas package). Places too
// small to have a shape at this scale are drawn as dots at DOTS below.

import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoPath } from 'd3-geo';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const countries = JSON.parse(readFileSync(join(root, 'src/data/learner-countries.json'), 'utf8'));
const topo = require('world-atlas/countries-110m.json');

// Names in the list that Natural Earth spells differently.
const ALIASES = { 'Czech Republic': 'Czechia' };
// Places with no shape in the 110m data: [longitude, latitude].
const DOTS = {
  Singapore: [103.82, 1.35],
  'Hong Kong': [114.17, 22.32],
  Bahrain: [50.55, 26.07],
  Mauritius: [57.55, -20.35],
  Barbados: [-59.54, 13.19],
  'Saint Lucia': [-60.98, 13.91],
};

const HIGHLIGHT = '#258EC2'; // the site's --primary-color
const REST = '#E5E7EB';
const WIDTH = 1000;

const wanted = new Set(countries.map((c) => ALIASES[c] || c));
const features = feature(topo, topo.objects.countries).features.filter((f) => f.properties.name !== 'Antarctica');
const found = new Set(features.map((f) => f.properties.name).filter((n) => wanted.has(n)));
const missing = countries.filter((c) => !found.has(ALIASES[c] || c) && !DOTS[c]);
if (missing.length) {
  console.error(`No shape or dot for: ${missing.join(', ')}. Add an alias or a dot in scripts/build-map.mjs.`);
  process.exit(1);
}

const projection = geoNaturalEarth1().fitWidth(WIDTH, { type: 'FeatureCollection', features });
const path = geoPath(projection);
const [, [, height]] = path.bounds({ type: 'FeatureCollection', features });

const shapes = features
  .map((f) => {
    const on = wanted.has(f.properties.name);
    return `<path d="${path(f)}" fill="${on ? HIGHLIGHT : REST}"${on ? ` data-name="${f.properties.name}"` : ''}/>`;
  })
  .join('\n');
const dots = countries
  .filter((c) => DOTS[c])
  .map((c) => {
    const [x, y] = projection(DOTS[c]);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${HIGHLIGHT}" stroke="#ffffff" stroke-width="1.5" data-name="${c}"/>`;
  })
  .join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${Math.ceil(height)}" role="img" aria-label="World map with the ${countries.length} countries where Learn AI Anywhere has learners highlighted">
<g stroke="#ffffff" stroke-width="0.5" stroke-linejoin="round">
${shapes}
</g>
${dots}
</svg>
`;
writeFileSync(join(root, 'src/assets/images/about/world-map.svg'), svg);
console.log(`world-map.svg: ${countries.length} countries, ${found.size} shapes and ${countries.length - found.size} dots, ${Math.round(svg.length / 1024)} KB`);

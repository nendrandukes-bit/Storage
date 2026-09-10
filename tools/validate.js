#!/usr/bin/env node
/* =========================================================
   npm run validate
   Pre-flight check for the drive: manifest entries must point at
   real files, ids must be unique, categories valid, nothing
   unlisted or orphaned. Run before you push.
   ========================================================= */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'js', 'manifest.js'), 'utf8');

/* Reads the array literal assigned to window.CLOUD_MANIFEST, ignoring the
   commented-out examples in the file header. */
function extractArray(fileSrc) {
  const noBlock = fileSrc.replace(/\/\*[\s\S]*?\*\//g, '');
  const lines = noBlock.split('\n').filter((l) => !/^\s*\/\//.test(l));
  const src = lines.join('\n');
  const m = src.match(/window\.CLOUD_MANIFEST\s*=\s*(\[[\s\S]*?\]);/);
  return m ? m[1] : null;
}

const literal = extractArray(src);
if (!literal) { console.error('✘ could not find window.CLOUD_MANIFEST in js/manifest.js'); process.exit(1); }

let rows = [];
try { rows = JSON.parse(literal); } catch (e) { console.error('✘ manifest is not valid JSON (must contain no comments or trailing commas): ' + e.message); process.exit(1); }

const CATS = ['photos', 'videos', 'docs', 'apk', 'audio', 'archives', 'code', 'other'];
const problems = [];
const ids = new Set();
const paths = new Set();

rows.forEach((r, i) => {
  const at = `entry ${i} (${r && r.name || '?'})`;
  ['id', 'name', 'category', 'path'].forEach((k) => {
    if (!r || typeof r[k] !== 'string' || !r[k]) problems.push(`${at}: missing "${k}"`);
  });
  if (r.id) { if (ids.has(r.id)) problems.push(`${at}: duplicate id "${r.id}"`); ids.add(r.id); }
  if (r.path) {
    if (paths.has(r.path)) problems.push(`${at}: duplicate path "${r.path}"`);
    paths.add(r.path);
    if (r.path.includes('..') || r.path.startsWith('/')) problems.push(`${at}: path must stay inside the repo`);
    const abs = path.join(ROOT, r.path || '');
    if (!fs.existsSync(abs)) problems.push(`${at}: file not found on disk — ${r.path}`);
    else if (r.size) {
      const real = fs.statSync(abs).size;
      if (real !== r.size) problems.push(`${at}: size says ${r.size} but the file is ${real} (run build:manifest)`);
    }
  }
  if (r.category && !CATS.includes(r.category)) problems.push(`${at}: unknown category "${r.category}"`);
  if (r.thumbPath && !fs.existsSync(path.join(ROOT, r.thumbPath))) problems.push(`${at}: thumbPath "${r.thumbPath}" is missing`);
  if (r.category && r.path && !r.path.startsWith('files/' + r.category + '/')) {
    problems.push(`${at}: path should live under files/${r.category}/`);
  }
  if (r.tags && !Array.isArray(r.tags)) problems.push(`${at}: tags must be an array`);
});

// unlisted files sitting in the folders
function walk(dir, base = '') {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((n) => {
    if (n.startsWith('.')) return [];
    const full = path.join(dir, n), rel = path.posix.join('files', base, n);
    return fs.statSync(full).isDirectory() ? walk(full, path.posix.join(base, n)) : (fs.statSync(full).size ? [rel] : []);
  });
}
walk(path.join(ROOT, 'files')).forEach((rel) => {
  if (!paths.has(rel)) problems.push(`orphan: ${rel} exists but is not in the manifest — run "npm run build:manifest"`);
});

const total = rows.reduce((a, r) => a + (r.size || 0), 0);
const tally = {};
rows.forEach((r) => (tally[r.category] = (tally[r.category] || 0) + 1));

console.log(`Nendu Cloud · manifest check`);
console.log(`  entries   ${rows.length}`);
console.log(`  published ${(total / 1048576).toFixed(2)} MB`);
Object.keys(tally).sort().forEach((c) => console.log(`  ${c.padEnd(10)} ${tally[c]}`));
if (!rows.length) console.log('  (empty drive: entries get published from files/ + this manifest)');

if (problems.length) {
  console.log(`\n✘ ${problems.length} problem(s):`);
  problems.forEach((p) => console.log('   · ' + p));
  process.exit(1);
}
console.log('\n✔ manifest is consistent — safe to push');

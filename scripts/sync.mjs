#!/usr/bin/env node
/**
 * Mirror the Peptlas open datasets into this repository.
 *
 * Everything here is generated from the live site: data/ comes from
 * peptlas.com/data/*, and README.md, CITATION.cff and .zenodo.json are rebuilt
 * from the site's catalog.json so the column definitions can never drift from the
 * files. Run daily by .github/workflows/sync.yml; safe to run by hand.
 *
 *   node scripts/sync.mjs                       # from https://peptlas.com
 *   PEPTLAS_DIST=../Peptlas/dist node scripts/sync.mjs   # from a local build
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = (process.env.PEPTLAS_SITE || 'https://peptlas.com').replace(/\/$/, '');
const DIST = process.env.PEPTLAS_DIST;
const REPO = 'https://github.com/Peptlas/peptlas-data';

async function get(path) {
  if (DIST) return readFileSync(join(DIST, path), 'utf8');
  const res = await fetch(`${SITE}${path}`, { headers: { 'User-Agent': 'peptlas-data-sync' } });
  if (!res.ok) throw new Error(`GET ${path}: HTTP ${res.status}`);
  return res.text();
}

const write = (rel, text) => {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, text.endsWith('\n') ? text : `${text}\n`);
};

const catalog = JSON.parse(await get('/data/catalog.json'));
const matrixJson = JSON.parse(await get('/data/peptide-status-matrix.json'));

// Guard: never overwrite good data with an empty or broken download.
for (const d of catalog.datasets) {
  const csv = await get(`/data/${d.file}`);
  const lines = csv.trim().split('\n');
  if (lines.length < 2 || lines[0] !== d.columns.map((c) => c.name).join(',')) {
    throw new Error(`${d.file}: header mismatch or no rows - refusing to write`);
  }
  write(`data/${d.file}`, csv);
}
write('data/peptide-status-matrix.json', JSON.stringify(matrixJson, null, 2));
write('data/catalog.json', JSON.stringify(catalog, null, 2));

const doiFile = join(ROOT, 'doi.txt');
const doi = existsSync(doiFile) ? readFileSync(doiFile, 'utf8').trim() || null : null;
const verified = catalog.last_verified; // YYYY-MM-DD (ET)
const version = verified.replace(/-/g, '.');
const title = 'Peptlas open data: peptide regulatory status by jurisdiction';
const homepage = catalog.homepage;
const keywords = ['peptides', 'BPC-157', 'semaglutide', 'compounding', '503A', 'FDA', 'TGA', 'MHRA', 'EMA', 'Health Canada', 'WADA', 'regulatory status'];
const abstract =
  'The regulatory status of peptides and related compounds under the U.S. FDA, Australia (TGA), the UK (MHRA), the EU (EMA), Health Canada and WADA, ' +
  'in a five-state taxonomy (compounding-legal, under review, in limbo, restricted, unscheduled), with a dated regulatory events log, ' +
  'FDA advisory committee votes and a source bibliography. Every row is verified by hand against primary regulator sources.';

const statuses = Object.entries(matrixJson.statuses)
  .map(([k, v]) => `| \`${k}\` | ${v.label} | ${v.meaning} |`)
  .join('\n');

const files = catalog.datasets
  .map((d) => `| [\`data/${d.file}\`](data/${d.file}) | ${d.title} | ${d.rows} |`)
  .join('\n');

const dictionaries = catalog.datasets
  .map(
    (d) =>
      `### ${d.title} - \`${d.file}\`\n\n${d.description}\n\n| Column | Meaning |\n|---|---|\n` +
      d.columns.map((c) => `| \`${c.name}\` | ${c.description} |`).join('\n'),
  )
  .join('\n\n');

const cite = `${catalog.publisher} (${verified.slice(0, 4)}). ${title} (Version ${version}) [Data set]. ${doi ? `Zenodo. https://doi.org/${doi}` : REPO}`;

write(
  'README.md',
  `# ${title}

${doi ? `[![DOI](https://zenodo.org/badge/DOI/${doi}.svg)](https://doi.org/${doi})\n\n` : ''}Where peptides such as BPC-157, TB-500, semaglutide and retatrutide stand with six authorities - the U.S. FDA, Australia's TGA, the UK's MHRA, the EU's EMA, Health Canada and WADA - as open, citable data from [Peptlas](${SITE}/), an independent regulatory-status reference that sells nothing.

**Snapshot:** verified ${verified} (ET). **Always-current version:** [${homepage.replace(/^https?:\/\//, '')}](${homepage})

This repository mirrors the live site daily. Releases are archived on Zenodo${doi ? ` ([doi:${doi}](https://doi.org/${doi}))` : ''}, so every version stays citable.

## Files

| File | Contents | Rows |
|---|---|---|
${files}
| [\`data/peptide-status-matrix.json\`](data/peptide-status-matrix.json) | The status grid with metadata and the status definitions | - |
| [\`data/catalog.json\`](data/catalog.json) | Machine-readable index of every file and column | - |

All files join on \`slug\`.

## The five states

Status is never reduced to legal / illegal. "In limbo" is the case the headlines miss: something moved on paper (a nomination, a removal from a restricted list, an advisory vote) but the legal status did not.

| Value | Label | Meaning |
|---|---|---|
${statuses}

Each authority answers a slightly different legal question: the FDA column is about pharmacy compounding under Section 503A, Australia is scheduling under the Poisons Standard, the UK and EU are marketing authorisation, Canada is authorization and the Prescription Drug List, and WADA is the sport rulebook. See [how to read each column](${homepage}#read-h).

## Columns

${dictionaries}

## How it is collected

Every row comes from a primary regulator publication (Federal Register, fda.gov, regulations.gov, the Poisons Standard, MHRA, EMA, Health Canada, WADA) and is verified by a person before it publishes. The U.S. sources are checked every six hours; the international jurisdictions change far less often and are re-verified in a monthly sweep. Tallies of advisory votes are labelled as reported until the FDA publishes official minutes. Full method: [${SITE.replace(/^https?:\/\//, '')}/methodology](${SITE}/methodology/).

## Cite

> ${cite}

Machine-readable: [\`CITATION.cff\`](CITATION.cff).

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Copy, chart and republish it, commercially too - credit **Peptlas** and link to [${homepage.replace(/^https?:\/\//, '')}](${homepage}).

## Not advice

Informational only - not medical or legal advice, and no health claim. Peptlas sells nothing, takes no money from vendors, and never suggests doses. Always confirm against the linked primary source.

## Corrections

Found an error? Open an issue here or write to research@peptlas.com. Corrections are published on the site's [changelog](${SITE}/changelog/).
`,
);

write(
  'CITATION.cff',
  `cff-version: 1.2.0
message: "If you use this dataset, please cite it as below."
type: dataset
title: "${title}"
abstract: "${abstract}"
authors:
  - name: "${catalog.publisher}"
version: "${version}"
date-released: ${verified}
license: CC-BY-4.0
url: "${homepage}"
repository: "${REPO}"
keywords:
${keywords.map((k) => `  - "${k}"`).join('\n')}
${doi ? `identifiers:\n  - type: doi\n    value: "${doi}"\n` : ''}`,
);

write(
  '.zenodo.json',
  JSON.stringify(
    {
      title,
      upload_type: 'dataset',
      description: `<p>${abstract}</p><p>Always-current version: <a href="${homepage}">${homepage}</a>. Informational only; not medical or legal advice.</p>`,
      creators: [{ name: catalog.publisher }],
      license: 'cc-by-4.0',
      access_right: 'open',
      version,
      language: 'eng',
      keywords,
      related_identifiers: [
        { identifier: homepage, relation: 'isDerivedFrom', resource_type: 'dataset', scheme: 'url' },
        { identifier: `${SITE}/methodology/`, relation: 'isDocumentedBy', resource_type: 'publication-other', scheme: 'url' },
      ],
    },
    null,
    2,
  ),
);

console.log(`synced ${catalog.datasets.length} datasets, version ${version}${doi ? `, doi ${doi}` : ''}`);

# Peptlas open data: peptide regulatory status by jurisdiction

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22965339.svg)](https://doi.org/10.5281/zenodo.22965339)

Where peptides such as BPC-157, TB-500, semaglutide and retatrutide stand with six authorities - the U.S. FDA, Australia's TGA, the UK's MHRA, the EU's EMA, Health Canada and WADA - as open, citable data from [Peptlas](https://peptlas.com/), an independent regulatory-status reference that sells nothing.

**Snapshot:** verified 2026-09-22 (ET). **Always-current version:** [peptlas.com/peptide-status-by-country/](https://peptlas.com/peptide-status-by-country/)

This repository mirrors the live site daily. Releases are archived on Zenodo ([doi:10.5281/zenodo.22965339](https://doi.org/10.5281/zenodo.22965339)), so every version stays citable.

## Files

| File | Contents | Rows |
|---|---|---|
| [`data/peptide-status-matrix.csv`](data/peptide-status-matrix.csv) | Regulatory status by jurisdiction | 114 |
| [`data/peptide-regulatory-events.csv`](data/peptide-regulatory-events.csv) | Regulatory events log | 23 |
| [`data/peptide-advisory-votes.csv`](data/peptide-advisory-votes.csv) | FDA advisory committee votes | 7 |
| [`data/peptide-sources.csv`](data/peptide-sources.csv) | Source bibliography | 184 |
| [`data/peptide-status-matrix.json`](data/peptide-status-matrix.json) | The status grid with metadata and the status definitions | - |
| [`data/catalog.json`](data/catalog.json) | Machine-readable index of every file and column | - |

All files join on `slug`.

## The five states

Status is never reduced to legal / illegal. "In limbo" is the case the headlines miss: something moved on paper (a nomination, a removal from a restricted list, an advisory vote) but the legal status did not.

| Value | Label | Meaning |
|---|---|---|
| `compounding_legal` | Compounding-legal | On the FDA 503A bulk-substances list; a licensed pharmacy may compound it. This is not the same as being an FDA-approved drug. |
| `under_review` | Under review | Actively before the FDA advisory committee; a decision is pending and the status can move. |
| `in_limbo` | In limbo | Moved on paper - nominated, removed from a restricted list, or recommended by an FDA committee - but not added to the 503A list. The headline implies a change; the legal status has not moved. |
| `restricted` | Restricted | Prescription-only, banned, controlled, or under active FDA enforcement. |
| `unscheduled` | Unscheduled | No specific federal action; unaddressed at this time. |

Each authority answers a slightly different legal question: the FDA column is about pharmacy compounding under Section 503A, Australia is scheduling under the Poisons Standard, the UK and EU are marketing authorisation, Canada is authorization and the Prescription Drug List, and WADA is the sport rulebook. See [how to read each column](https://peptlas.com/peptide-status-by-country/#read-h).

## Columns

### Regulatory status by jurisdiction - `peptide-status-matrix.csv`

One row per compound and authority: the current status under the U.S. FDA, Australia (TGA), the UK (MHRA), the EU (EMA), Health Canada and WADA, in a five-state taxonomy, with a plain-language note.

| Column | Meaning |
|---|---|
| `compound` | Compound name as used on Peptlas. |
| `slug` | Stable identifier; joins the other files. |
| `jurisdiction` | Authority, e.g. "United States (FDA)". |
| `regulator` | Short regulator name: FDA, TGA, MHRA, EMA, Health Canada, WADA. |
| `status` | compounding_legal | under_review | in_limbo | restricted | unscheduled. |
| `status_label` | Human label for status. |
| `note` | What the status means for this compound under this authority. |
| `entry_url` | The Peptlas entry, with every primary source. |
| `last_verified` | Date (ET) the row was last verified by hand against primary sources. |

### Regulatory events log - `peptide-regulatory-events.csv`

Dated regulatory events for the tracked compounds (list removals, advisory votes, comment deadlines, enforcement), each with a neutral one-line summary and its primary source.

| Column | Meaning |
|---|---|
| `date` | Event date (ET). |
| `compound` | Compound name. |
| `slug` | Joins the other files. |
| `tag` | not_legalized | status_change | review_scheduled | comment_deadline | enforcement | correction | clarification. |
| `summary` | What happened, and what it did not change. |
| `source_url` | Primary or best-available source for the event. |
| `id` | Stable event identifier. |

### FDA advisory committee votes - `peptide-advisory-votes.csv`

Pharmacy Compounding Advisory Committee votes on the tracked compounds. Advisory votes do not change legal status. Where the FDA has not published minutes, tallies are as reported and the reporting source is named.

| Column | Meaning |
|---|---|
| `compound` | Compound name. |
| `slug` | Joins the other files. |
| `date` | Vote date (ET). |
| `committee` | The committee that voted. |
| `question` | The question put to the committee. |
| `outcome` | recommended | not_recommended. |
| `yes` | Yes votes (as reported where noted). |
| `no` | No votes. |
| `abstain` | Abstentions. |
| `tally_source` | Who reported the tally, while official minutes are unpublished. |
| `us_status_now` | The compound's current U.S. status - a vote alone never moves it. |

### Source bibliography - `peptide-sources.csv`

Every source cited by a Peptlas entry: regulator publications, dockets, warning letters and the reporting behind them, with what each one establishes.

| Column | Meaning |
|---|---|
| `compound` | Compound name. |
| `slug` | Joins the other files. |
| `label` | Source title as cited. |
| `url` | Source URL. |
| `note` | What the source is cited for, where recorded. |

## How it is collected

Every row comes from a primary regulator publication (Federal Register, fda.gov, regulations.gov, the Poisons Standard, MHRA, EMA, Health Canada, WADA) and is verified by a person before it publishes. The U.S. sources are checked every six hours; the international jurisdictions change far less often and are re-verified in a monthly sweep. Tallies of advisory votes are labelled as reported until the FDA publishes official minutes. Full method: [peptlas.com/methodology](https://peptlas.com/methodology/).

## Cite

> Peptlas Research Team (2026). Peptlas open data: peptide regulatory status by jurisdiction (Version 2026.09.22) [Data set]. Zenodo. https://doi.org/10.5281/zenodo.22965339

Machine-readable: [`CITATION.cff`](CITATION.cff).

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Copy, chart and republish it, commercially too - credit **Peptlas** and link to [peptlas.com/peptide-status-by-country/](https://peptlas.com/peptide-status-by-country/).

## Not advice

Informational only - not medical or legal advice, and no health claim. Peptlas sells nothing, takes no money from vendors, and never suggests doses. Always confirm against the linked primary source.

## Corrections

Found an error? Open an issue here or write to research@peptlas.com. Corrections are published on the site's [changelog](https://peptlas.com/changelog/).

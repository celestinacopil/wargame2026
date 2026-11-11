# Arctic Crisis wargame website: context for AI assistants

This repo is the website for **Arctic Crisis**, a fictional wargame run by the Sciences Po Cybersecurity Association on **5 December 2026**. It's a static site (plain HTML, CSS and JavaScript, with no build step), published with GitHub Pages at https://celestinacopil.github.io/wargame2026/.

> **This repo is public, and players can read everything in it.** Never write flags, solutions, secret codes or organiser-only scenario details into this file, commit messages or visible page text. Answers belong in the organisers' private scenario document.

## The game

- There are two fictional Arctic countries. **Darsenia** is a small, unstable democracy. **Belvaria** is a personalised autocracy. They dispute a maritime border over a newly discovered oil field.
- The trigger event: the Darsenian research vessel **Aurora** suffered an explosion on 3 Dec 2026 at 06:40 UTC. Accident or sabotage?
- There are four teams: Darsenia Government, Darsenia Cyber, Belvaria Government and Belvaria Cyber.
- The game has a planning phase, then 3 rounds, then an ending. Each round has a diplomatic phase (government teams negotiate) and an actions phase. Cyber teams solve CTF challenges throughout.
- Each country has stats: military, navy, economy, trust/domestic politics, diplomacy and cyber. The team with the most points overall wins. Solving a cyber challenge adds cyber points; using hints gives fewer points.
- **Audience:** students who are interested in cybersecurity but mostly have **no technical background**. Keep challenges beginner-friendly and educational, give clear guidance, and explain any real tool you use.

## Site structure

| Path | What it is |
|---|---|
| `index.html` | Login portal: pick a team, enter the country password |
| `assets/config.js` | Team roles and passwords (a browser-only gate, not real security) |
| `assets/portal.js` | Login/session, the team dashboard's progress counter, and the flag checking |
| `assets/hints.js`, `hints.css` | "Request a hint" buttons that log requests to the organisers (see `templates.txt`) |
| `assets/government-*.js` | Embeds the Google Apps Script decision room for government teams |
| `teams/*.html` | Each team's dashboard (challenge cards) |
| `challenges/<country>/challenge-0N.html` | One page per challenge, 6 per country |
| `challenges/darsenia/evidence/` | Evidence files (PDFs etc.) for the Darsenia challenges |
| `government/` | Briefs for government teams |
| `organisers.html` | Organiser console (Apps Script iframe) |
| `tools-darsenia/` | Hub page listing Darsenia's investigation tools |

### In-game fictional tools and sources
| Path | Tool |
|---|---|
| `search/` | **Seekr** search engine; its index is in `search/database.js` |
| `web-archive/` | Web archive of earlier page versions (`catalog.js` + `captures/`) |
| `business-registry/` | Belvarian business register |
| `konekt/` | **Konekt** social network |
| `vesseltrace/` | **VesselTrace** ship database (owner/manager/ISM data, AIS position history) + distance calculator. Data lives in `vesseltrace/catalog.js` |
| `forensics/` | Fake Linux terminal that imitates `exiftool`. Evidence metadata is in `forensics/files.js`, the command logic in `terminal.js` |
| `ministriaenergiye.bv/`, `www.deuters.com/`, `www.belvariatoday.bv/`, `www.dcg.dr/` | Fictional ministry, news and coast-guard websites |

Some data files (`vesseltrace/catalog.js`, `forensics/files.js`) start with an **organiser comment** explaining how the puzzle works. Keep these up to date when you change the data.

## Challenge status

| | Darsenia | Belvaria |
|---|---|---|
| 01 | Built: compare news sources and timestamps (web archive) | Placeholder (planned: phishing) |
| 02 | Placeholder | Placeholder |
| 03 | Built: identify a vessel from an intelligence report + VesselTrace | Placeholder |
| 04 | Built: company ownership / corruption trail (remote flag check) | Placeholder |
| 05 | Built: EXIF analysis in the forensic terminal | Placeholder |
| 06 | Placeholder (planned: PIN code race) | Placeholder |

Darsenia's challenges form one investigation chain, and later challenges build on earlier answers. **Keep names, dates, times, coordinates and companies consistent** across challenges and tools. Check the existing data files before inventing anything new.

## How flags are checked

Each challenge page ends with a `<script id="challenge-data" type="application/json">` block, which `assets/portal.js` reads:

- **`"enabled": false`** hides the flag form (an unreleased challenge).
- **`"acceptedHashes": [...]`** is the preferred local check. It stores SHA-256 hashes of the **lowercase, trimmed** flag, so the answer is not readable in the source. Make a hash with:
  ```sh
  printf '%s' 'flag{your answer}' | shasum -a 256
  ```
  Add one hash for each accepted spelling. `portal.js` contains a plain-JavaScript SHA-256 fallback for `file://` pages.
- **`"acceptedFlags": [...]`** is the older plain-text check. Avoid it, because it reveals the answer.
- **`"validation": "remote"`** checks flags via the Google Apps Script (used by Darsenia 04, with multiple objectives). `"remoteId"` sends a different challenge ID to the server, so a challenge can move to another slot without breaking the server's answer lookup.
- Don't put the answer in the `"feedback"` text either: it sits in the page source.
- Local checks save progress only in the player's browser (`localStorage`) and do **not** notify the organisers. Moving all checks to the Apps Script is on the to-do list.

## Conventions

- Write in plain English for non-technical players. Every fictional site has a footer saying it is fictional.
- Don't impersonate real organisations or reuse real brands. Use original names (e.g. "Deuters", "VesselTrace").
- Use relative links (the site is served from a subfolder on GitHub Pages). **Folder names are case-sensitive** on GitHub Pages.
- When you change `assets/portal.js`, bump the version in the challenge pages' script tag (`portal.js?v=N`) so browsers don't keep a stale cached copy.
- Each challenge page follows the same layout: Instructions, Evidence, Investigation guidance, Check your flag.
- When adding a new tool, link it from `tools-darsenia/index.html` and, if it should be searchable, add it to `search/database.js`.

## Testing

- Serve the site locally from the repo root: `python3 -m http.server 8000`, then open http://localhost:8000. Log in with the team password from `assets/config.js`.
- Node.js may not be installed. On macOS you can syntax-check JavaScript with the built-in engine:
  `/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc -e 'checkSyntax("path/to/file.js")'`

## Known issues

- In `search/database.js`, two entries link to `../archive/` and `../Konekt/`. The real folders are `web-archive/` and lowercase `konekt/`, so these links break on GitHub Pages.
- There is no investigation-tools page for Belvaria yet.

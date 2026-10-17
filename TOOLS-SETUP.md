# Tools and archive addition

Built from the uploaded wargame2026-master.zip. Scenario date: 3 December 2026.

Upload the contents of this package to the repository root, preserving paths. Replace the four teams/*.html files when prompted. They only gain an Investigation tools link. No existing article, challenge, password or shared portal script is changed.

New paths:
- tools/index.html: shared tools directory.
- tools/tools.js: return link to the current team's dashboard.
- archive/index.html: archive search.
- archive/archive.css: archive appearance.
- archive/catalog.js: searchable URLs and their captures.
- archive/search.js: search and URL normalization.
- archive/captures/deuters-20261203-0715.html: simulated 07:15 capture.

Try https://www.deuters.com/mysterious-explosion-on-board-of-aurora.html in the archive, or paste the full GitHub Pages article URL. www and non-www, http and https, query strings and fragments are accepted for the same page. Other URLs show no captures.

The capture uses the uploaded article's existing body text, removes its 08:40 update timestamp, and corrects Wednesday to Thursday for 3 December 2026. Its snapshot banner is not part of the original article. The live Deuters article is unchanged and still needs the planned updated paragraph confirming the compartment. Do not assume this patch implements that later edit.

To add captures: place a static HTML copy in archive/captures, add its entry in archive/catalog.js, and check all relative links. An archived copy must not load its article body from the live page or it will not preserve history.

The archive and tools are shared public game resources. This is a fictional archive with scripted captures, not a connection to the Internet Archive. It makes no network requests to entered URLs. No flags or solutions are shown in the tools page or search results.

Checks completed: JavaScript syntax, relative file targets, search normalization and match/no-match/error paths. Visual browser rendering not verified.

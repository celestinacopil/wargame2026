# Wargame 2026 portal

Repository: wargame2026
Published address: https://celestinacopil.github.io/wargame2026/

## Install
Copy the CONTENTS of this folder into the existing repository's GitHub Pages publishing folder. Replace index.html. Do not put a second wargame2026 folder inside the repository. Keep unrelated files. Use main / (root) if that is your current Pages source. Commit, wait for the Pages deployment, then hard refresh.

The two articles are copies of the published articles retrieved during this request. Their paths are preserved, including www.belvariatoday.bv. If you edit the live articles after this package was created, keep your newer article copies.

## Files
- index.html: role selection and password form.
- assets/config.js: four role passwords and dashboard addresses.
- assets/style.css: shared appearance.
- assets/portal.js: shared login, progress and flag logic.
- teams/darsenia-government.html: Darsenian government resources.
- teams/darsenia-cyber.html: Darsenian six-challenge dashboard.
- teams/belvaria-government.html: Belvarian government resources.
- teams/belvaria-cyber.html: Belvarian six-challenge dashboard.
- challenges/darsenia/challenge-01.html through challenge-06.html.
- challenges/belvaria/challenge-01.html through challenge-06.html.
- www.deuters.com/mysterious-explosion-on-board-of-aurora.html
- www.belvariatoday.bv/aurora-explosion-equipment-failure.html

## Test passwords
Darsenia government: darsenia-gov2026
Darsenia cyber: darsenia2026
Belvaria government: belvaria-gov2026
Belvaria cyber: belvaria2026
Change them in assets/config.js before use.

## Add or change a challenge
1. Edit only its challenges/COUNTRY/challenge-NN.html file.
2. Replace its title, visible heading, instructions and evidence links.
3. At the bottom, edit the application/json block. Set enabled to true, acceptedFlags to an array such as ["FLAG{your_answer}"], and feedback to the success message. Keep id unchanged.
4. JSON uses double quotes and no trailing commas. You can write long instructions as ordinary HTML paragraphs, without joining JavaScript strings.
5. Update the corresponding card title and badge from Not released to Available in teams/COUNTRY-cyber.html.
6. Test a wrong flag and a correct flag.

Darsenia challenge 01 preserves FLAG{Source_2_paragraph_2}. Matching ignores case and surrounding spaces, but not internal spaces or underscores. Its instructions define paragraph counting.

## Add government resources
Edit the appropriate teams/COUNTRY-government.html file. Replace the placeholder paragraph with a list of links. No government challenges are assumed yet.

## Relative links
From index.html: ./www.belvariatoday.bv/aurora-explosion-equipment-failure.html
From teams/*.html: ../www.belvariatoday.bv/aurora-explosion-equipment-failure.html
From challenges/COUNTRY/*.html: ../../www.belvariatoday.bv/aurora-explosion-equipment-failure.html
Do not use links beginning with / unless you include /wargame2026/.

## Behaviour and limits
Passwords are a browser gate, not security. Source, answers and public files are inspectable. Session storage keeps login in the current tab. Logging out removes login but keeps accepted flags. A link opened in a separate tab may require login again. Unreleased challenges do not accept flags. Their HTML is still public, so do not put future secrets there before release.

Progress is local to each browser and origin, not shared with team members or organisers. No central scoring or submission backend is included. Browser storage must be allowed for login. Clearing site storage resets progress. Existing v1 portal results are not migrated because their storage format differs.

## Validation
JavaScript syntax, local link targets, challenge data and browser logic are checked in the supplied package. Visual browser rendering is not verified.

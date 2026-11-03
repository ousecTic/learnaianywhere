# Test findings: Part 2 (Claude)

Checked 2 November 2026 against the deploy preview https://deploy-preview-1--silver-ganache-efcc26.netlify.app (branch `redesign` at bd748cb), in the app's built-in Chromium browser at 1280, 768 and 375 wide. Files were downloaded fresh and read with scripts.

**Result:** 119 items in C1 to C12. 105 pass and are ticked in `test-checklist.md`. 11 fail and 3 are doubts (not ticked). They are listed below, most important first. Passes are not listed.

## Fixed after the test (same day, not yet re-checked on the deploy preview)

Henry asked for these fixes. Each was checked in the local dev server.
- **1:** the banner and the install page's back link now go to `#get`, and land on Get the course.
- **3:** the install page now says "under 200 MB". The guide masters on Drive still say "120 to 200 MB"; change them there too.
- **4:** the DonorBox script is loaded once and kept, so returning to Donate no longer throws. Its iframe attribute is now spelled `allowpaymentrequest`, which stops a React dev warning.
- **5, 6:** Esc closes the gallery picture and focus goes back to it. AI Courses is a real button (Esc closes the menu). Gallery pictures and the Gen AI section headers open with Tab and Enter. Get Involved tabs show a focus ring. The hamburger is labelled "Menu".
- **7:** question 1 stacks its two choices below 900px wide, and question 2 goes one per row below 640px. No title wraps between 641 and 1280px. A smaller font couldn't fix it alone: it would have had to drop to about 13px.
- **8:** card, lesson, plan and FAQ text is 16px. The question subtitles went from 13 to 14px. The home statistics went from 13/14 to 16px. Only captions and the small uppercase labels stay smaller.
- **Noticed in passing:**
  - The About captions are now #4B5563 (7.6:1 contrast).
  - Donate says "courses" instead of "curriculum".
  - The Gen AI slides embed on a phone went from 219px to 299px wide.

Still open:
- **2:** the ZIP folder shape. Decided: wait for Henry's Moodle test (H2). If Moodle can open START HERE inside the folder, only the "Learning platform" plan text needs a clearer sentence. Don't just flatten the main ZIP: the installed Android app drops the first folder of every path in the ZIP (`CoursePackPlugin.java:409`), so a flat ZIP would break the course in the app. v1.5 is also already published, and the build won't replace its files. If a flat ZIP is needed, add a separate platform ZIP for the "Learning platform" plan instead.
- **9:** the H1 camera item. Close it.
- **D1 to D3.**

## Failures

### 1. The banner and the install page link to `#download`, which doesn't exist
- **Items:** C2 Announcement banner (click goes to Get the course), C2 Navigation (`#` links scroll to their section), C8 Install steps page (back link goes to Get the course).
- **What I did:** clicked the banner text on the home page. Also opened `/courses/ai-literacy-for-everyone/install-android` and read its "← AI Literacy for Everyone" link.
- **What I saw:** the address ends in `#download`, but the course page opens at the top (scrollY 0). No element has `id="download"`. The section's id is `get`. The hero's own "Get the course" button (`#get`) scrolls correctly. Same result at every width.
- **Likely cause:** the section was renamed to `id="get"` but two links weren't updated: `src/components/AnnouncementBanner.jsx:28` and `src/pages/AndroidInstallSteps.jsx:42`. The comment in `src/components/ScrollToTop.jsx:5` still uses `#download` as its example.

### 2. The computer ZIP has START HERE.html one folder down, not at the top level
- **Item:** C8 Computer ZIP, "plain HTML package with START HERE.html at the top level".
- **What I did:** listed the English, Arabic and Swahili (Kenya) v1.5 ZIPs.
- **What I saw:** every entry sits inside one folder, for example `AI Literacy for Everyone - English/START HERE.html`. Nothing is at the root of the ZIP. A platform that unpacks an HTML package and looks for the entry file at the root won't find it. Henry's H2 Moodle and Kolibri test will show whether this matters in practice.
- **Likely cause:** the package build zips the named folder rather than its contents (`scripts/build_course.py`, package step).

### 3. "120 to 200 MB" doesn't cover English (116 MB)
- **Item:** C8 Install steps page, "the sizes quoted match the real package sizes".
- **What I saw:** step 7 says the app downloads "120 to 200 MB". The real v1.5 packages run from 116 MB (English, 115,741,129 bytes) to 197 MB (Urdu). The teacher guide says the same "120 to 200 MB" in its Getting the course table, in every language I read.
- **Likely cause:** the range was written for v1.0, when English was 119 MB. The fix is in `src/pages/AndroidInstallSteps.jsx:33` and the guide masters on Drive, for example "about 115 to 200 MB".

### 4. Clicking around the site and back to Donate prints red console errors
- **Item:** C2 Navigation, "no red errors in the console on any page".
- **What I did:** opened Donate, went to About, came back to Donate (navbar links, no reload).
- **What I saw:** `Uncaught SyntaxError: Identifier 'scriptOrigin' has already been declared`, once for every later visit to Donate. The form still loads (iframe 900 px tall). No other page printed errors.
- **Likely cause:** `src/pages/Donation.jsx:7-11` adds `https://donorbox.org/widget.js` to `<head>` on every mount. The second copy redeclares a global `const`. Load it only if it isn't already there.

### 5. Esc doesn't close the About gallery's large picture
- **Items:** C10 Gallery ("Esc closes"), and part of C12 Keyboard.
- **What I did:** on `/about` at 1280, clicked the first gallery picture, then pressed Escape.
- **What I saw:** the large view stayed open. The × and clicking outside both close it.
- **Likely cause:** `src/components/ImageModal.jsx` has no keydown handler.

### 6. Keyboard: several controls can't be reached, or show no focus ring
- **Item:** C12 Keyboard only ("Tab reaches every link and button…, a visible focus ring shows").
- **What I saw** (from the DOM and the CSS, all widths):
  - The navbar's **AI Courses** opener is a `<span onClick>` (`src/components/Navbar.jsx:62`). Tab skips it, so the two course links are hidden from keyboard users on a laptop.
  - **About gallery** pictures are `<div onClick>` (`src/pages/AboutUs.jsx:186`). They can't be focused or opened from the keyboard.
  - The **Gen AI page section headers** (Overview, Setup, Lesson Plan, Project Worksheet) are `<div onClick>` (`src/pages/IntroToGenerativeAI.jsx:13`). They can't be opened from the keyboard.
  - The **Get Involved tabs** remove the focus outline (`.tab:focus-visible { outline: none; }`, `src/App.css:745`).
  - The phone **hamburger button** has no text and no `aria-label` (`.menu-btn`). A screen reader announces just "button".
- The course page itself is fine: lesson rows, mode and device choices and the language menus are real buttons and selects with a focus ring.

### 7. "Learners go through it on their own" wraps to two lines at tablet width
- **Item:** C6, "2 choices per row… at desktop and tablet… every title on one line".
- **What I saw:** at 768 the choices are 2 per row and question 2 is 2×2, as intended. But the second choice's title "Learners go through it on their own" wraps onto two lines. At 1280 every title is on one line. At 375 the cards are one per row and that title also wraps, which is probably unavoidable there.
- **Likely cause:** the card is too narrow at 768 for that title at its current size (`src/pages/AILiteracyForEveryone.css`, `.alfe-device`). A smaller title size between about 520 and 900 px would fix it, or a shorter title ("On their own").

### 8. Body text below 16px
- **Item:** C12, "body text at least 16px".
- **What I saw** (375, same at other widths):
  - Course page: the six "What's in the course" card texts and several other paragraphs are 15px. The two question-1 choice subtitles are 13px. The eyebrow is 14px (fine, it's a label).
  - Home: the three statistic card sentences are 13px.
  - About: the photo caption and "Video edited by…" are 14px (fine for captions).
- **Likely cause:** the font sizes in `src/pages/AILiteracyForEveryone.css` and `.stat-description` in `src/components/Mission.css:43`.

### 9. One H1 item is no longer true: slide 2 doesn't mention a camera
- **Item:** C1, "each item in H1 is still true".
- **What I did:** exported slide 2 of all 9 decks from Google (PDF), and read slide 2 of the decks inside the English, Arabic and Swahili ZIPs.
- **What I saw:** slide 2 ("Prerequisite") now lists only the app (neuropocket.com, Android and Windows, included in the course package) and the optional worksheet. "Camera" doesn't appear anywhere in the English deck. The H1 decision about the camera can be closed.
- **The other 7 H1 items are still true:**
  - The hero eyebrow and the banner say "8 languages", but the menu has 9 entries.
  - `/this-does-not-exist` shows the navbar and footer with an empty `<main>`.
  - Switching back to English shows "Switched to English. Everything below, and all the files, are now in English."
  - Both Swahili versions use the same guide, slides, worksheet and example IDs, but different video folders (`1j3SzbK…` for Kenya, `1drV-nH…` for Tanzania).
  - The mini-app pages aren't in the navbar.
  - The gallery alt text and captions say "Students".
  - Get Involved shows "Ensures AI courses relevance and alignment…" under both Teachers and Partners.

## Doubts (not ticked)

### D1. C4 Trailer: it plays from course-videos, not site-media
One click (done with a script) plays `course-videos-v1.5/en-intro-01.mp4` (1620×1080, with controls, nothing downloaded before the click). It doesn't play `site-media/course-trailer.mp4` as the item says. In `src/pages/AILiteracyForEveryone.jsx:257` the `site-media` file is only used when a language has no video of its own, and every language has one. So the file is never used. Either the checklist wording is out of date, or the `site-media` file can go. I didn't force an MP4 failure, so the Drive fallback is untested. The code switches to it on `onError` or when the video has no picture.

### D2. C8 Computer ZIP in Edge and Firefox: not tested
I only had the built-in Chromium browser. In it, START HERE.html (English, Arabic, Swahili Kenya) loaded with zero requests outside `127.0.0.1`, NeuroPocket's frame included. Edge and Firefox are left for Henry's H5 pass.

### D3. C8 NeuroPocket training with the built-in pictures: started, not seen finishing
NeuroPocket opens inside the offline course with no outside requests (Bias Challenge, 41 built-in pictures). I picked 3 bears and 3 dogs and pressed Train. The console logged "Starting model training…" with no errors, but after 80 seconds it still showed "Training…". The app's browser pane was hidden at the time, which pauses page drawing, and that likely stalled it. Henry's H5 covers this on a real machine.

## Noticed in passing (no checklist item fails)
- About: the photo caption and "Video edited by…" are grey #9CA3AF on white, a contrast of 2.5:1. That's below the 4.5:1 minimum for small text.
- The Donate page text still says "test and refine our **curriculum**". The Gen AI page says "Students will…" and "in your classroom". The first About gallery caption mentions "the 'Intro to AI' course".
- Gen AI page at 375: the Google Slides embed is only 219×122 px (wide side margins inside the section).
- The `course-latest/downloads.json` pointer the app reads is v1.5, and all 9 sizes, hashes and URLs match `course/downloads.json`. The `app-latest/app.json` still says versionName 1.0.0 (3,037,445 bytes, the same as the APK). That's fine if the app hasn't changed.

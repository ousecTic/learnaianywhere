# Test checklist for the redesigned learnaianywhere.org

Written 2 November 2026 against the `redesign` branch (commit `f0b0f19`).
Tick each box as you go. Anything that fails: note the page, what you did, what you saw, and the browser and device.

**Where to test.** Do most of it on the Netlify deploy preview, which is built the same way as the live site:
https://deploy-preview-1--silver-ganache-efcc26.netlify.app
Then do a quick pass on the live site after merging to `master`.

**Browsers and devices.** At minimum: Chrome on a Windows laptop, Safari on an iPhone, Chrome on an Android phone, and one of Firefox or Edge. Many of your teachers are on cheap Android phones, so give that one the most time. Use a private or incognito window at least once so you see the site the way a first-time visitor does (announcement banner showing, nothing remembered).

---

## 0. Known issues to confirm before anything else

These are things the code already tells us. Check them first so you don't rediscover them later.

- [x] **Trailer takes two clicks.** Fixed on 2 November 2026: the `site-media` release now holds the trailer MP4 and one click plays it on the deploy preview (checked in Chrome). Still test item 3.3 on a phone.
- [ ] **Slide 2 of the course deck says a camera is required.** All 9 language decks. The website now says a camera is optional. Decide whether to fix the slides before launch or accept the mismatch.
- [ ] **"8 languages" vs 9 packages.** The hero eyebrow and the announcement banner say 8 languages. The language menu has 9 entries because Swahili comes in a Kenya and a Tanzania version. Decide if that is what you want.
- [ ] **Unknown web addresses show an empty page.** There is no "page not found" route. Open `/this-does-not-exist`: you get the navbar and footer with nothing in between. Decide whether that is acceptable for launch.

---

## 1. Site-wide (check on every page)

### 1.1 Announcement banner (top strip)
- [ ] Shows on first visit (private window) with the text: "New: AI Literacy for Everyone, a free AI course in 8 languages. Teach it yourself or let learners go through it on their own, with or without internet."
- [ ] Clicking the text goes to the course page and lands on the **Get the course** section (the address ends in `#download`; check it actually scrolls there and not to the top).
- [ ] The × button hides it, and it stays hidden after a reload and when you open other pages.
- [ ] It is hidden only in that browser. A different browser or private window shows it again.
- [ ] On a phone the text wraps and the × is still tappable and not overlapping the text.

### 1.2 Navbar
- [ ] Logo goes to the home page.
- [ ] **AI Courses** opens a dropdown with **AI Literacy for Everyone** and **Introduction to Generative AI**. Both go to the right page.
- [ ] The arrow next to AI Courses flips when open.
- [ ] Clicking anywhere outside the dropdown closes it.
- [ ] **Get Involved**, **About Us**, **Donate** and the **Contact** button go to the right pages.
- [ ] The current page is reachable from every other page (no dead ends).
- [ ] **Phone:** the hamburger opens the menu, the AI Courses item expands inside it, tapping a link closes the menu, scrolling closes the menu, tapping outside closes it.
- [ ] **Phone:** the menu does not overlap or hide the announcement banner's × button.
- [ ] Nothing in the navbar says "Lessons" or "Kit" any more.

### 1.3 Footer
- [ ] Logo goes home.
- [ ] Quick Links: Get Involved, About Us.
- [ ] AI Courses: AI Literacy for Everyone, Introduction to Generative AI.
- [ ] Connect: Volunteer and Partner with Us (both go to Get Involved), Contact Us.
- [ ] LinkedIn icon opens https://www.linkedin.com/company/learn-ai-anywhere/ in a new tab.
- [ ] Copyright year shows 2026.
- [ ] The Creative Commons link opens in a new tab.
- [ ] "Design by Karen Tang" link works.
- [ ] Wording says "AI courses", not "AI lessons" or "curriculum".

### 1.4 Navigation behaviour
- [ ] Opening a new page starts at the top, not where you left the previous page.
- [ ] Links with a `#` (for example the banner's `#download`, the course page's `#get` and `#materials`) scroll to that section.
- [ ] Browser back and forward buttons work and restore the right page.
- [ ] Reloading any page (for example `/about`, `/courses/ai-literacy-for-everyone`) loads that page, not a Netlify 404. This checks the `_redirects` catch-all.
- [ ] Old addresses still work: `/curriculum` and `/curriculum/intro-to-ai` both redirect to the course page. `/curriculum/intro-to-generative-ai` still shows the Gen AI course. These are the links other sites and Kolibri may have.
- [ ] Browser tab title is "Learn AI Anywhere" and the tab icon is the logo.
- [ ] No red errors in the browser console (F12 → Console) on any page.
- [ ] Google Analytics loads (in F12 → Network, filter "gtag" or "collect").

---

## 2. Home page `/`

### 2.1 Hero
- [ ] Heading "AI Education That Works Anywhere" and the one-line description.
- [ ] **See the courses** goes to the course page. **About Us** goes to About.
- [ ] The animated GIF on the right plays and is not stretched. On a phone it sits under the text, not beside it.

### 2.2 Statistics
- [ ] The intro sentence reads naturally and ends in a full stop.
- [ ] Three cards: **2.2B** (ITU, 2025), **2/3** (UNESCO IITE, 2022), **50%** (UNESCO, 2020). The 41% card is gone.
- [ ] Each source link opens in a new tab and lands on the right page or PDF:
  - ITU: https://www.itu.int/en/ITU-D/Statistics/Pages/facts/default.aspx
  - UNESCO IITE PDF: https://iite.unesco.org/wp-content/uploads/2023/07/Analytical-report-fnl5.pdf
  - UNESCO 2020: https://www.unesco.org/en/articles/startling-digital-divides-distance-learning-emerge
- [ ] Each card's wording is short enough to fit without the card growing taller than the others on a laptop, and reads fine on a phone.
- [ ] The closing sentence "That's why we created Learn AI Anywhere..." is there.

### 2.3 How Learn AI Anywhere Works
- [ ] Three cards (Offline-First, Mobile-Friendly, Video Guidance). Every button goes to the course page.
- [ ] Wording says "courses", not "lessons" or "curriculum".

### 2.4 Our Global Reach
- [ ] Says "We have learners in 80 countries".
- [ ] The map shows and every country from your list is shaded. Spot-check a few small ones that are drawn as dots: Singapore, Hong Kong, Bahrain, Mauritius, Barbados, Saint Lucia.
- [ ] Spot-check a few that are easy to get wrong: Czechia, both Congos (if on the list), Kenya, Tanzania, Uganda, Pakistan, Colombia.
- [ ] Map is crisp when you zoom the browser (it is an SVG, so it should not go blurry).
- [ ] On a phone the map fits the screen without sideways scrolling.

### 2.5 Call to action
- [ ] "Ready to Make a Difference?" with Contact Us going to `/contact`.

---

## 3. AI Literacy for Everyone `/courses/ai-literacy-for-everyone`

This is the page to spend the most time on.

### 3.1 Hero text
- [ ] Eyebrow: "Free course · Ages 11 and up · 8 languages". Confirm "Ages 11 and up" is what the teacher guide says.
- [ ] Heading "AI Literacy for Everyone".
- [ ] Lead: "A 4-lesson course on how AI works. Learners train their own AI and learn to use it responsibly, with or without internet."
- [ ] **Try it online now** opens `/course/online/en/` (English, since the hero is always English).
- [ ] **Get the course** scrolls down to the Get the course section.
- [ ] Small note under the buttons: "In English here. Other languages are under Get the course." and its link scrolls to the section.
- [ ] Nothing in the hero feels crowded on a laptop or a phone. On a phone the trailer sits under the text.

### 3.2 Trailer, fallback (only if the GitHub file ever stops working)
- [ ] The cover picture shows with a "Watch the trailer" pill.
- [ ] Clicking it: the browser tries the GitHub MP4, fails, and shows the Drive player instead. One more click on Drive's play button starts the video. (This is the known two-click behaviour.)
- [ ] Choosing a language from the arrow next to "Try it online" (or lower on the page) plays that language's trailer, which is its dubbed "Welcome to the Course" video. Check at least Urdu, Arabic and one Swahili, with sound.

### 3.3 Trailer
- [ ] One click on the cover starts the video with sound, with the browser's own controls.
- [ ] Pause, scrub, full screen and mute all work.
- [ ] Works on iPhone Safari (plays inline, does not jump to full screen on its own).
- [ ] Works on Android Chrome.
- [ ] The video is the right one (the course trailer, not a lesson video) and the whole thing plays to the end.
- [ ] The cover picture is shown as the poster while it loads.

### 3.4 What's in the course
- [ ] Heading and the line "Use all of it, or only the parts you need."
- [ ] Six cards in this order: Teacher guide, Slides, Worksheet, 25 short videos, Games and quizzes, NeuroPocket app.
- [ ] Each has a small label, either "To teach with" or "To learn with". No "For students" or "For you" wording left.
- [ ] Each picture loads and matches its card (the guide card shows the guide's first page, the worksheet card shows the worksheet, and so on). The two "page" cards (guide, worksheet) are drawn as portrait pages.
- [ ] The Slides text says "each with a recap quiz and then project time" (not "quiz on the last slides").
- [ ] The NeuroPocket text does not say a camera is required.
- [ ] 3 columns on a laptop, 2 on a tablet, 1 on a phone. No card text is cut off.

### 3.5 The 4 lessons (accordion)
- [ ] Heading and the line about teaching all 4 in a day or one a day.
- [ ] Four rows: 1. What is AI? (25–30 min), 2. The key parts of machine learning (25–30 min), 3. How do machines train? (30–40 min), 4. Can machines be responsible? (30–40 min). Confirm these titles and times match the teacher guide.
- [ ] All four start closed.
- [ ] Clicking a row opens it; clicking it again closes it; opening another closes the first (only one open at a time).
- [ ] The chevron turns when open.
- [ ] Inside each: a picture of the activity, "Learners will:" with the objectives, and the small tags (Slides, N short videos, activity name, Recap quiz, Worksheet part N).
- [ ] Video counts: 4, 5, 7, 7 (with the 2 introduction videos that is 25, matching the card above and the files section). Confirm against the Drive folders.
- [ ] Objectives match the teacher guide word for word or close to it.
- [ ] Activity names match the slides: AI or Not game, Train a model in NeuroPocket, Describer Drawer game, Bias challenge in NeuroPocket.
- [ ] **Keyboard:** Tab to a lesson row, press Enter or Space, it opens. Screen reader users get the open/closed state (the row is a real button with aria-expanded).
- [ ] On a phone the time and chevron do not wrap onto their own line awkwardly.

### 3.6 Get the course: language
- [ ] Heading "Get the course in English" and under it "Version 1.3" and the release date.
- [ ] The language menu has 9 entries in this order: English, Français (French), Español (Spanish), Português (Portuguese), العربية (Arabic), हिन्दी (Hindi), اردو (Urdu), Kiswahili – Kenya (Swahili), Kiswahili – Tanzania (Swahili).
- [ ] Choosing a language changes the heading ("Get the course in French") and a green note appears: "Switched to French. Everything below, and all the files, are now in French."
- [ ] The green note stays visible when you switch again (it should not disappear and reappear oddly).
- [ ] Switching back to English keeps the note (it says "Switched to English"). Decide if that is fine.
- [ ] The Arabic and Urdu labels render in their script and are readable in the menu on Windows, Mac, iPhone and Android.
- [ ] The language menu is usable with a keyboard (arrow keys change it) and on a phone (the native picker opens).

### 3.7 Get the course: the two questions
- [ ] Question 1 "How do you want to use it?" has two choices: **I'll teach it** (selected by default) and **Learners go through it on their own**.
- [ ] With "I'll teach it" selected there is **no** question 2.
- [ ] Choosing "Learners go through it on their own" makes question 2 "Where will learners use it?" appear with four choices: On a computer (selected by default), Android phone or tablet, Learning platform, Online.
- [ ] Switching back to "I'll teach it" hides question 2 again and the plan changes back.
- [ ] The selected choice is clearly highlighted. The choices work with Tab and Enter and announce pressed state (aria-pressed).
- [ ] On a phone the choices stack or shrink without text being cut.

### 3.8 The plan card: "I'll teach it"
Do this once in English, then once in a non-Latin language (Arabic or Urdu) and once in Swahili (Kenya).
- [ ] Title "Teach it yourself, in English" (changes with the language).
- [ ] Five steps: 1 Read the teacher guide, 2 Get the slides, 3 Print the worksheet, 4 Put NeuroPocket on one device per group, 5 Start teaching the first lesson.
- [ ] Step 1 buttons PDF and Word download the guide **in the chosen language**. Open each file and check it is the right language and the right document.
- [ ] Step 2 buttons: "PDF · 15 MB" and "PowerPoint · 95 MB" (sizes shown because they are big). Both download, both are the slides in the chosen language.
- [ ] Step 3 buttons: Worksheet (PDF), Worksheet (Word), Filled-in example (PDF). All three download in the chosen language.
- [ ] Step 4 buttons: Android app (APK from the NeuroPocket 1.8.0 release), Windows app (EXE), Online at neuropocket.com (opens in a new tab). Step 4 text says a camera is optional.
- [ ] Step 5 has no buttons, just text.
- [ ] The picture on the right is a slide with the caption about teaching from one deck. On a phone it moves under the steps.
- [ ] The closing note: "Want to see how we teach it? ... Watch the videos online or download them." "Watch the videos online" opens `/course/online/<language>/`. "download them" opens the All the files section further down (it should expand it **and** scroll to it).
- [ ] No step says how many minutes anything takes (timings are only on the lesson cards).
- [ ] No step says "students" or "class".

### 3.9 The plan card: "Learners go through it on their own" → On a computer
- [ ] Title "Learners go through it on their own, in English".
- [ ] Step 1 "Download the course to a computer" with the big button "Download the course · English · 119 MB". The size changes per language (French 185 MB, Urdu 202 MB, and so on). The button downloads the ZIP straight away (no new tab).
- [ ] Step 2 "Learners open START HERE and start Lesson 1".
- [ ] No third step: the plan ends at step 2 (no "print the worksheet").
- [ ] The picture is the START HERE screenshot with the caption about the 4 lessons and Resources.
- [ ] Closing note links to the All the files section and opens it.

### 3.10 Plan: Android phone or tablet
- [ ] Step 1 "Install the app on the learners' phones or tablets" with the big button "Download the app · 3 MB". Downloads the APK from the `app-latest` release.
- [ ] Under it, "See the install steps with pictures" goes to `/courses/ai-literacy-for-everyone/install-android`.
- [ ] The text mentions choosing the language inside the app and that iPhone/iPad users should use it online.
- [ ] Step 2 "Learners open the app and tap Lesson 1".

### 3.11 Plan: Online
- [ ] Step 1 "Share the link with learners" with the big button "Open the course · English" (arrow icon, not a download icon). It opens `/course/online/en/`; after switching language it opens that language's folder (for example `/course/online/sw-TZ/`).
- [ ] The text says nothing to install, needs internet the whole time.
- [ ] Step 2 as above, and no step 3.

### 3.12 Plan: Learning platform
- [ ] Step 1 "Upload the course to your platform" with the big ZIP button and text explaining it is added as an HTML package.
- [ ] Two Kolibri links, "on a computer" and "on Android", each opening the right Google Doc in a new tab. Check both docs are shared so anyone with the link can view (open them in a private window).
- [ ] Step 2 as above, and no step 3.

### 3.13 Every button, every language (the tedious but important one)
Switch through all 9 languages and, in the All the files section (3.14), click every button. For each language check:
- [ ] Teacher guide PDF and Word open and are in that language.
- [ ] Slides PDF and PowerPoint open and are in that language.
- [ ] Worksheet PDF and Word, Worksheet example PDF and Word.
- [ ] Each worksheet is 1 page in every language. The guide is 4 pages (5 in Hindi and Urdu) with no heading stranded at the bottom of a page.
- [ ] The ZIP downloads and its size matches the label.
- [ ] "Open in Google Drive" opens that language's video folder and the folder is viewable without signing in.
- [ ] YouTube button: English says "Watch on YouTube"; other languages say "Watch in English on YouTube" and the Lesson videos text adds "On YouTube they are in English only."
- [ ] Both Swahili versions point at the same guide, slides and worksheet but different video folders. Confirm that is intended.
- [ ] No button shows as greyed out "Coming soon". If one does, that resource is missing from `course/downloads.json`.
- [ ] Downloads (ZIP, APK, EXE, Google exports) do **not** open a new tab. Pages (Drive folder, YouTube, Kolibri docs, neuropocket.com) **do** open in a new tab.

### 3.14 All the files section
- [ ] Heading "All the files, in English" (changes with the language).
- [ ] Starts collapsed with a "Show all the files" button. Clicking shows everything and the button becomes "Hide the files".
- [ ] Links from the plan notes ("download them", "list at the bottom of this page") open it and land on it.
- [ ] "To teach with" rows: Teacher guide, Slides, Worksheet, Worksheet example, Lesson videos, NeuroPocket app.
- [ ] "The course to learn with" rows: For a computer (ZIP with size), For Android (app · 3 MB + Install steps), Online (Open the course in English), On Kolibri (On a computer, On Android).
- [ ] On a phone the buttons wrap under the description instead of overflowing sideways.

### 3.15 Common questions
- [ ] Five questions: Do I need internet to teach it? / Do I need to know about AI already? / Does every learner need a device? / Can one person take it alone? / Can I share or change it?
- [ ] The device answer says one device per group is enough and the worksheet can be on paper (it must **not** say "no devices at all").
- [ ] The "alone" answer says one person with one device can do the whole course.
- [ ] The licence answer links to CC BY-NC-SA in a new tab.

### 3.16 Content accuracy on this page
- [ ] Every number on the page matches reality: 4 lessons, 25 videos, 1-page worksheet, 8 languages, version 1.3 and its date, 3 MB app, ZIP sizes, NeuroPocket 1.8.0.
- [ ] "About an hour of lesson videos" is right (you measured 51.5 minutes).
- [ ] Nothing says "kit", "students", "class" or "classroom" where you wanted "course", "learners", "group".
- [ ] Nothing refers to things that no longer exist on the page (for example "3 pages", "the language picker above", "Both").

---

## 4. The course itself (what people actually download)

### 4.1 Computer ZIP (do English fully, and spot-check Arabic or Urdu plus one Swahili)
- [ ] Download, unzip, **turn Wi-Fi off**, open START HERE.html in Chrome, Edge and Firefox. It works with no internet.
- [ ] The lessons are listed on the left, "Start the course" on the right, matching the screenshot on the website.
- [ ] Lesson 1 plays its videos in order with captions. The AI or Not game works. The recap quiz works and gives a score.
- [ ] Lessons 2 to 4 the same. NeuroPocket opens offline from the course and lets you train with the built-in pictures.
- [ ] The worksheet app lets you type and keeps what you typed after closing and reopening the browser.
- [ ] Progress is remembered after closing and reopening.
- [ ] The Resources section contains the guide, slides, worksheet and example in that language.
- [ ] Arabic and Urdu show right-to-left correctly, including inside the quizzes and the worksheet app.
- [ ] Copy the unzipped folder to a USB stick and open it from another computer. Still works.
- [ ] The SHA-256 of each ZIP matches `course/downloads.json` (optional, only if you want to be sure the uploads are not corrupted).

### 4.2 Android app
- [ ] On a real Android phone, follow the install steps page exactly. Every screenshot matches what the phone actually shows (at least on one phone; note differences on others).
- [ ] The app downloads the chosen language, shows progress, survives a dropped connection, then opens the course.
- [ ] Turn off data and Wi-Fi: the whole course still works, videos play, NeuroPocket works.
- [ ] Changing language later is possible (or if it is not, the website does not promise it).
- [ ] The app checks the `course-latest` release for updates and does not crash if offline.

### 4.3 Online kit `/course/online/<language>/`
- [ ] All 9 addresses load: `/course/online/en/`, `fr`, `es`, `pt`, `ar`, `hi`, `ur`, `sw-KE`, `sw-TZ`. (A missing trailing slash should also work; try `/course/online/en`.)
- [ ] Videos stream. (They come from the `course-videos-v1.3` release; it should hold 225 files, 25 videos × 9 languages.)
- [ ] Captions show.
- [ ] Quizzes, AI or Not, worksheet app and NeuroPocket all work inside it.
- [ ] Progress is remembered on reload.
- [ ] Works on a phone in portrait: the sidebar can be opened and closed, videos fit the width.
- [ ] Arabic and Urdu are right-to-left.
- [ ] No link inside the online kit points at a local file that only exists in the ZIP.

### 4.4 Mini-app pages on the website
- [ ] `/courses/ai-literacy-for-everyone/ai-or-not` shows the AI or Not game inside the site layout and the frame grows with the content (no inner scrollbar, no cut-off bottom).
- [ ] `/courses/ai-literacy-for-everyone/recap-quiz-1` through `recap-quiz-4` each show the right lesson's quiz.
- [ ] Adding `?lang=fr` (or `ar`, `ur`, `sw`, `hi`, `pt`, `es`) to those addresses switches the game or quiz language. `?lang=ar` is right-to-left.
- [ ] Finishing a quiz, the frame resizes to show the result without cutting it off.
- [ ] These pages are not linked from the navbar, so decide whether that is intended (they exist for Kolibri and the course to link to).

### 4.5 Install steps page `/courses/ai-literacy-for-everyone/install-android`
- [ ] "← AI Literacy for Everyone" link at the top goes back to the course page's Get the course section.
- [ ] Eight steps, each with a tall phone screenshot and short text. Pictures load (first two straight away, the rest as you scroll).
- [ ] Step 1's "Download the app" link downloads the APK.
- [ ] The sizes quoted ("120 to 200 MB") match the real package sizes.
- [ ] The last line says the app is Android only.
- [ ] On a phone the picture is above the text, and the page is not wider than the screen.

---

## 5. Introduction to Generative AI `/curriculum/intro-to-generative-ai`

- [ ] The yellow banner reads exactly: "This course is currently being renovated. Content and resources may be updated. If you'd like to sign up as an early tester for our latest changes, contact us at contact@learnaianywhere.org." The email is a mailto link that opens with the subject "Early tester".
- [ ] Heading and intro paragraph.
- [ ] Overview section is open by default; the other sections open and close when you click their headers, and the + / − sign flips.
- [ ] The embedded Google Slides preview loads inside the page and you can click through slides.
- [ ] Lesson plan buttons: PowerPoint and PDF downloads of the deck.
- [ ] Project worksheet: PDF and Word; example: PDF and Word. All open the right document.
- [ ] Setup → Android: Pocketpal (Play Store page loads), SmolLM2 model link starts a GGUF download from Hugging Face (about 1 GB; cancel after it starts), Kiwix (Play Store), Offline Encyclopedia (Drive file opens and is shared with anyone).
- [ ] Setup → Windows: Llamafile link starts a download from Hugging Face (the description says one file includes the model, with no second download under it), Kiwix (Microsoft Store page loads), Offline Encyclopedia.
- [ ] Wording says "this course", not "this curriculum".
- [ ] Both Contact buttons go to `/contact`.
- [ ] On a phone the slides embed fits and the section headers are tappable.

---

## 6. About Us `/about`

- [ ] Opening paragraph is your wording about the three gaps (internet, devices, ICT-skilled teachers). The three links (ITU, UNESCO IITE PDF, UNESCO 2020) open in new tabs.
- [ ] Second paragraph "So we started Learn AI Anywhere and built a course to address all three...".
- [ ] Uganda photo loads. Caption: "This picture was taken in Uganda by Michael from Future Upgrade. A group of students is using Michael's phone and data to play with ChatGPT. This photo is what inspired us to develop an offline-first AI literacy course."
- [ ] "Today we have learners in 80 countries across the world:" followed by the same map as the home page.
- [ ] The handwritten learner note shows with its intro line.
- [ ] "Teachers tell us the same. A school principal, after going through our course:" and then the video in a framed box, not thin, with the poster picture showing before play.
- [ ] Video plays with sound on laptop, iPhone and Android. Captions ("CC") can be turned on and are in sync and anonymised (name replaced by "[He gives his name.]", "I'm the principal of a school.").
- [ ] "Video edited by Leah Sugg and Gabrielle Augier." under the video.
- [ ] Nothing names the principal or the school anywhere on the page, in the captions file, or in the video's visible frames (watch it through once with that in mind).
- [ ] Gallery: 12 pictures, clicking opens a large view with the caption; close with the × and by clicking outside; Esc closes it (if not, note it). Captions still say "students" here: decide if you want that changed to match the course page wording.
- [ ] Partner logos: Kiwix, Future Upgrade, Learning Equality, Learning Passport, AI Literacy Day, OLI. Each opens its site in a new tab and the logo is not stretched.
- [ ] Contact Us button at the bottom.

---

## 7. Get Involved, Contact, Donate

### 7.1 Get Involved `/get-involved`
- [ ] Volunteers tab is open by default, Partnerships tab switches content, the active tab is highlighted.
- [ ] Teachers, Translators, Ambassadors cards. Teachers has four bullet points.
- [ ] Wording says "AI courses" (the Partners card has a sentence that reads oddly: "Ensures AI courses relevance and alignment..." appears twice, once under Teachers and once under Partners. Decide if you want to reword it).
- [ ] Contact Us button.

### 7.2 Contact `/contact`
- [ ] Email shown: contact@learnaianywhere.org.
- [ ] **Copy Email** copies it (paste somewhere to check) and shows the "Email copied to clipboard!" toast, which disappears on its own.
- [ ] Copy works on iPhone Safari and Android Chrome (clipboard permissions differ).
- [ ] The "What to Include" list shows.

### 7.3 Donate `/donate`
- [ ] The DonorBox form loads inside the page and is tall enough to show the whole form without an inner scrollbar.
- [ ] Going to another page and coming back to Donate still loads the form (the page adds and removes DonorBox's script; a second visit sometimes breaks embeds).
- [ ] The classroom photo and its caption show.
- [ ] Try a donation only if you want to test the full flow; otherwise just confirm the amount buttons and the card form appear.

---

## 8. Phones, tablets and accessibility

- [ ] Every page at phone width (375 px): no sideways scrolling, nothing cut off, buttons big enough to tap, text at least 16 px.
- [ ] Every page at tablet width (768 px).
- [ ] Browser zoom at 200% on a laptop: layout still works.
- [ ] Rotate a phone to landscape on the course page: the trailer and the plan card still fit.
- [ ] **Keyboard only** (unplug the mouse): Tab reaches every link and button in a sensible order, a visible focus ring shows where you are, Enter activates things, Esc closes the gallery modal.
- [ ] Screen reader spot-check (Windows Narrator or iPhone VoiceOver) on the course page: lesson rows announce open/closed, the mode and device choices announce selected, the language menu is labelled "Language", the green switched-language note is announced.
- [ ] Every image has sensible alt text (the trailer cover is deliberately empty alt because the button has its own label).
- [ ] Colour contrast: the green note, the grey "To teach with" labels, and the muted text under file rows are readable.
- [ ] The site does not break in the browser's dark mode (it is designed light; just confirm nothing becomes unreadable).

---

## 9. Speed

- [ ] Run Lighthouse (Chrome F12 → Lighthouse, Mobile) on the home page and the course page. Note the Performance score and anything flagged as a huge image.
- [ ] The course page does not download the trailer video until you click play.
- [ ] The About page does not download the testimony video until you click play (it is set to preload nothing; check in F12 → Network).
- [ ] Pictures lower on the course page load only when scrolled to.
- [ ] Try the course page on a slow connection (F12 → Network → throttle "Slow 3G"): the text appears first and nothing jumps around badly as images load.

---

## 10. Launch and after

- [ ] Merge the draft PR into `master` and confirm Netlify builds it (the build runs `build:apps` first, which needs the `course/apps` and `course/online` folders to be in the repo).
- [ ] On the live site https://learnaianywhere.org repeat sections 1, 2, 3.1–3.3, 3.6–3.8, 4.3 (one language), 5 (banner), 6 (video).
- [ ] Hard-refresh the live site in a browser that had the old site cached, to make sure old pages and the old world-map PNG are gone.
- [ ] Open the live site on a phone that has never visited it.
- [ ] Check Google Search Console or Analytics a day later for 404s from old addresses you may have missed.
- [ ] Links you have shared elsewhere (Kolibri, partner sites, social posts, the slides' QR codes if any) still land somewhere sensible.
- [ ] The Design artifact and the deploy preview can be left as they are; nothing on the live site points at the deploy preview address (already checked: no `deploy-preview` in the source).

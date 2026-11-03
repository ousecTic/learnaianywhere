# Test checklist for the redesigned learnaianywhere.org

Written 2 November 2026 against the `redesign` branch. Reorganised the same day into two parts: **Part 1 is Henry's**, **Part 2 is Claude's**. Every item is in exactly one part. Tick each box as you go. Anything that fails: note the item number, what you did, what you saw, and the browser and device.

**Where to test.** The Netlify deploy preview, built the same way as the live site:
https://deploy-preview-1--silver-ganache-efcc26.netlify.app
After the merge, a quick pass on the live site (H10 and C13).

**How the split works.** Henry's part is everything that needs a real device, a real account, another platform, sound, or a decision. Claude's part is everything that can be checked from a browser on a computer, from the files themselves, or with a script. The two parts don't depend on each other, so both can start now. Claude reports only failures, each with its item number.

---

# Part 1: Henry

Start with H2 (platforms) and H3 (Android app). They take the longest and need nothing from Claude's pass.

## H1. Decisions

Claude will confirm each of these is still true (C1). You decide what to do.

- [x] ~~Slide 2 of the course deck says a camera is required.~~ No longer true: checked 2 November 2026, the word "camera" is in none of the 9 v1.5 decks (228 pages each). Nothing to decide.
- [x] **"8 languages" vs 9 packages.** Decided 2 November 2026: keep "8 languages" and both Swahili entries for now; revisit with feedback. The hero and the announcement banner say 8 languages. The language menu has 9 entries because Swahili comes in a Kenya and a Tanzania version. Keep "8"?
- [x] ~~Unknown web addresses show an empty page.~~ Decided: add a simple page. Done 2 November 2026: `/this-does-not-exist` now shows "Page not found" with buttons to the course and the home page.
- [x] ~~Switching back to English keeps the green note~~ ("Switched to English"). Decided 2 November 2026: fine as is.
- [x] ~~Both Swahili versions share the same guide, slides and worksheet~~ but have different video folders. Decided 2 November 2026: keep as is and revisit once Swahili-speaking teachers give feedback.
- [ ] **Mini-app pages** (`/courses/ai-literacy-for-everyone/ai-or-not`, `recap-quiz-1` to `-4`) are not linked from the navbar. They exist for Kolibri and the course to link to. Intended?
- [ ] **About page gallery captions still say "students".** Change to match the course page wording ("learners")?
- [ ] **Get Involved:** "Ensures AI courses relevance and alignment..." appears under both Teachers and Partners and reads oddly. Reword?

## H2. Learning platforms

The "Learning platform" plan tells people to add the ZIP as an HTML package. Nobody has done that with the v1.5 ZIP yet.

- [ ] **Moodle.** Add the English ZIP to a course as a File resource (or as an HTML package if your Moodle has one), set it to open START HERE.html, and go through Lesson 1 as a learner: videos, AI or Not, quiz. Note exactly which resource type worked, so the plan's text can say so.
- [ ] **Kolibri on a computer.** Follow the Google Doc the plan links to. Everything it says to click still exists in the current Kolibri. The course in the Kolibri library is the current one (or note which version it is).
- [ ] **Kolibri on Android.** The same with the Android doc.
- [ ] **Google Classroom.** Attach the ZIP, or the online link, as a material and open it as a student. Note which of the two works better; the plan currently suggests the ZIP.
- [ ] One non-English language (French or Swahili) on whichever platform was easiest.
- [ ] Tell Claude what you learned, so the "Learning platform" plan text and the FAQ match reality.

## H3. Android app on a real phone

- [ ] Follow the install steps page (`/courses/ai-literacy-for-everyone/install-android`) exactly, on a real Android phone. Every one of the 8 screenshots matches what the phone actually shows (at least on one phone; note differences on others).
- [ ] The app downloads the chosen language, shows progress, survives a dropped connection, then opens the course.
- [ ] Turn off data and Wi-Fi: the whole course still works, videos play, NeuroPocket works.
- [ ] Changing language later is possible (or if it is not, the website does not promise it).
- [ ] The app checks for updates and does not crash if offline. (Claude checks the pointer file it reads, C8.)
- [ ] The sizes quoted on the install page ("120 to 200 MB") feel right for what the phone downloaded.

## H4. Real phones: iPhone Safari and Android Chrome

Do each of these on both phones. Many of your teachers are on cheap Android phones, so give that one the most time. Use a private window at least once so you see the site as a first-time visitor.

- [ ] **Trailer:** one tap on the cover starts the video with sound. On iPhone it plays inline and does not jump to full screen on its own. Pause, scrub, full screen and mute work.
- [ ] **Dubbed trailers:** pick Urdu, Arabic and one Swahili from the language arrow next to "Try it online". Each plays that language's "Welcome to the Course" video and the dubbing sounds right.
- [ ] **Announcement banner:** the text wraps and the × is tappable and not overlapping the text. The hamburger menu does not hide the ×.
- [ ] **Hamburger menu:** opens, the AI Courses item expands inside it, tapping a link closes it, scrolling closes it, tapping outside closes it.
- [ ] **Language menu:** the native picker opens, and the Arabic and Urdu labels render in their script.
- [ ] **Get the course:** the two questions stack one card per row, the plan card's big button wraps as text ("Download the / course · 116 MB") with the size on one line, the START HERE picture sits under the step.
- [ ] **Download the course** on the phone: the ZIP downloads (you don't have to open it there).
- [ ] **Online kit** (`/course/online/en/`) in portrait: the sidebar opens and closes, videos fit the width and play with sound, a quiz works.
- [ ] **About page video:** plays with sound, captions (CC) can be turned on and are in sync.
- [ ] **Contact:** Copy Email copies the address (paste it somewhere) and the toast shows. Clipboard permissions differ on iPhone.
- [ ] **Landscape:** rotate the phone on the course page; the trailer and the plan card still fit.
- [ ] **Every page** at phone width: no sideways scrolling, nothing cut off, buttons big enough to tap.
- [ ] **A day of normal use** on your own phone: anything that annoys you is a finding.

## H5. The computer ZIP, truly offline

Claude runs the same course from a local server (C8); you check the parts that need a real machine.

- [ ] Download the English ZIP, unzip it, **turn Wi-Fi off**, open START HERE.html. Go through Lesson 1: videos with captions, AI or Not, recap quiz with a score.
- [ ] NeuroPocket opens from the course and lets you train with the built-in pictures, still with Wi-Fi off.
- [ ] Copy the unzipped folder to a USB stick and open it from another computer. Still works.
- [ ] If you have access to a cheap or old laptop, the same there.

## H6. Sound and video on a laptop

- [ ] Trailer plays to the end with sound in Chrome, and in Firefox or Edge. It is the course trailer, not a lesson video.
- [ ] About page testimony video plays with sound. Watch it through once with this in mind: nothing in the picture names the principal or the school.
- [ ] One lesson video in the online kit, in a non-English language, with sound: it is the right language.

## H7. Screen reader, speed and slow connections

- [ ] **Screen reader** (iPhone VoiceOver or Windows Narrator) on the course page: lesson rows announce open/closed, the mode and device choices announce selected, the language menu is labelled "Language", the green switched-language note is announced.
- [ ] **Lighthouse** (Chrome F12 → Lighthouse, Mobile) on the home page and the course page. Note the Performance score and anything flagged as a huge image.
- [ ] **Slow 3G** (F12 → Network → throttle) on the course page: the text appears first and nothing jumps around badly as images load.

## H8. Donate

- [ ] Try a donation only if you want to test the full flow. Otherwise skip: Claude checks that the form loads (C11).

## H9. Translations

- [ ] Native-speaker review of the rewritten teacher guide in all 7 translations (French, Spanish, Portuguese, Arabic, Hindi, Urdu, Swahili). They are machine-made. The Drive masters are the ones to correct; Claude can then re-release.

## H10. Launch and after

- [ ] Merge the draft PR into `master` and confirm Netlify builds it.
- [ ] Open the live site https://learnaianywhere.org on a phone that has never visited it.
- [ ] Hard-refresh the live site in a browser that had the old site cached, to make sure old pages and the old world-map PNG are gone.
- [ ] Links you have shared elsewhere (Kolibri, partner sites, social posts, QR codes on the slides if any) still land somewhere sensible.
- [ ] Check Google Search Console or Analytics a day later for 404s from old addresses.
- [ ] The YouTube playlist still has the Prerequisite video that was removed from the course. Decide whether to remove it there too.

---

# Part 2: Claude

All on the deploy preview, at desktop (1280), tablet (768) and phone (375) widths, in a private window, unless an item says otherwise.

## C1. Known issues

- [ ] Each item in H1 is still true, so Henry decides on facts, not memories.

## C2. Site-wide (every page)

**Announcement banner**
- [x] Shows on first visit with the text: "New: AI Literacy for Everyone, a free AI course in 8 languages. Teach it yourself or let learners go through it on their own, with or without internet."
- [ ] Clicking the text goes to the course page and lands on the Get the course section (address ends in `#download`; it scrolls there, not to the top).
- [x] The × hides it, and it stays hidden after a reload and on other pages. A different browser or private window shows it again.

**Navbar**
- [x] Logo goes home. AI Courses opens a dropdown with AI Literacy for Everyone and Introduction to Generative AI; both go to the right page. The arrow flips when open. Clicking outside closes it.
- [x] Get Involved, About Us, Donate and the Contact button go to the right pages. Every page is reachable from every other page.
- [x] Nothing in the navbar says "Lessons" or "Kit".
- [x] At phone width the hamburger opens the menu, the AI Courses item expands inside it, a link closes it, scrolling closes it, clicking outside closes it.

**Footer**
- [x] Logo goes home. Quick Links: Get Involved, About Us. AI Courses: both courses. Connect: Volunteer and Partner with Us (both to Get Involved), Contact Us.
- [x] LinkedIn icon opens https://www.linkedin.com/company/learn-ai-anywhere/ in a new tab. The Creative Commons link opens in a new tab. "Design by Karen Tang" works.
- [x] Copyright year 2026. Wording says "AI courses", not "AI lessons" or "curriculum".

**Navigation**
- [ ] Opening a new page starts at the top. Links with a `#` (the banner's `#download`, the course page's `#get`) scroll to that section.
- [x] Back and forward restore the right page.
- [x] Reloading `/about` and `/courses/ai-literacy-for-everyone` loads the page, not a Netlify 404 (the `_redirects` catch-all).
- [x] `/curriculum` and `/curriculum/intro-to-ai` redirect to the course page. `/curriculum/intro-to-generative-ai` still shows the Gen AI course.
- [x] Tab title "Learn AI Anywhere", tab icon is the logo.
- [ ] No red errors in the console on any page. Google Analytics requests go out (gtag / collect).

## C3. Home page `/`

- [x] Hero: heading "AI Education That Works Anywhere" and the one-line description. See the courses → course page. About Us → About. The GIF plays, is not stretched, and sits under the text at phone width.
- [x] Statistics: intro sentence ends in a full stop. Three cards: 2.2B (ITU, 2025), 2/3 (UNESCO IITE, 2022), 50% (UNESCO, 2020). No 41% card. Cards are the same height on a laptop.
- [x] Each source link opens in a new tab and lands on the right page: ITU facts page, the UNESCO IITE PDF, the UNESCO 2020 article.
- [x] Closing sentence "That's why we created Learn AI Anywhere..." is there.
- [x] How it works: three cards (Offline-First, Mobile-Friendly, Video Guidance); every button goes to the course page; wording says "courses".
- [x] Global reach: "We have learners in 80 countries". Every country on the list is shaded in the SVG, including the dot countries (Singapore, Hong Kong, Bahrain, Mauritius, Barbados, Saint Lucia) and the easy-to-get-wrong ones (Czechia, both Congos, Kenya, Tanzania, Uganda, Pakistan, Colombia). The map fits the screen at phone width.
- [x] Call to action: "Ready to Make a Difference?" with Contact Us → `/contact`.

## C4. Course page: hero and trailer

- [x] Eyebrow "Free course · Ages 11 and up · 8 languages". "Ages 11 and up" matches the teacher guide.
- [x] Heading and lead: "A 4-lesson course on how AI works. Learners train their own AI and learn to use it responsibly, with or without internet."
- [x] **Try it online in English** opens `/course/online/en/`. The arrow next to it opens the "Language of the course" menu; picking a language changes the button text, the trailer, and the Get the course section below.
- [x] **Get the course** scrolls to the section.
- [ ] Trailer: the cover picture shows as the poster, one click starts the MP4 from the `site-media` release with the browser's own controls. If the MP4 fails, the Drive player shows instead.
- [x] The trailer video is not downloaded until play is clicked (Network tab).
- [x] Nothing in the hero is crowded at laptop or phone width; at phone width the trailer sits under the text.

## C5. Course page: What's in the course and The 4 lessons

- [x] "Use all of it, or only the parts you need." Six cards in order: Teacher guide, Slides, Worksheet, 25 short videos, Games and quizzes, NeuroPocket app. Labels are "To teach with" or "To learn with"; no "For students" or "For you".
- [x] Each picture loads and matches its card; the guide and worksheet cards are drawn as portrait pages.
- [x] Slides text says "each with a recap quiz and then project time". NeuroPocket text does not say a camera is required.
- [x] 3 columns on a laptop, 2 on a tablet, 1 on a phone; no card text cut off.
- [x] Lessons: heading and the line about teaching all 4 in a day or one a day. Four rows with the right titles and times (25–30, 25–30, 30–40, 30–40 min); these match the teacher guide.
- [x] All start closed; clicking opens, clicking again closes, opening another closes the first; the chevron turns.
- [x] Inside each: activity picture, "Learners will:" objectives, tags (Slides, N short videos, activity name, Recap quiz, Worksheet part N).
- [x] Video counts 4, 5, 7, 7, plus 2 introduction videos = 25, matching the card and the Drive folders.
- [x] Objectives match the teacher guide. Activity names match the slides: AI or Not game, Train a model in NeuroPocket, Describer Drawer game, Bias challenge in NeuroPocket.
- [x] Keyboard: Tab to a row, Enter or Space opens it; the row is a real button with aria-expanded.
- [x] At phone width the time and chevron do not wrap awkwardly.

## C6. Course page: Get the course

- [x] Heading "Get the course in English", under it "Version 1.5" and the release date.
- [x] Language menu: 9 entries in this order: English, Français (French), Español (Spanish), Português (Portuguese), العربية (Arabic), हिन्दी (Hindi), اردو (Urdu), Kiswahili – Kenya (Swahili), Kiswahili – Tanzania (Swahili). Arrow keys change it.
- [x] Choosing a language changes the heading and shows the green note "Switched to French. Everything below, and all the files, are now in French." The note stays visible when switching again.
- [x] Question 1 "How do you want to use it?": I'll teach it (default) and Learners go through it on their own. With "I'll teach it" there is no question 2.
- [x] Choosing "on their own" shows question 2 "Where will learners use it?" with On a computer (default), Android phone or tablet, Learning platform, Online. Switching back hides it and the plan changes back.
- [x] The selected choice is highlighted; choices work with Tab and Enter and announce aria-pressed.
- [ ] Question 2 shows 2 choices per row (2×2) down to 640px wide and one per row below; question 1 shows its 2 choices side by side above 900px and stacked below (its long title needs the width); no card alone in a row; every title on one line except on a phone.
- [x] At phone width the big plan button wraps as text and the size never splits across lines.

## C7. Course page: the plan cards and every button in every language

**"I'll teach it"**
- [x] Starts with the small "YOUR PLAN" label, no big title, no picture, no closing note. Each step is a heading, one short line and its buttons.
- [x] Five steps: 1 Read the teacher guide (PDF, Word), 2 Get the slides (PDF · 15 MB, PowerPoint · 95 MB), 3 Print the worksheet (Worksheet PDF, Worksheet Word, Filled-in example PDF), 4 Put NeuroPocket on one device per group (Android app, Windows app, Online at neuropocket.com), 5 Watch the lesson videos (Open in Google Drive, Watch online, and Watch on YouTube in English only).
- [x] Step 4 text does not mention a camera. No step gives minutes. No step says "students" or "class".
- [x] No language other than English shows a YouTube button.

**"Learners go through it on their own"** (all four plans)
- [x] One step, no step number, no title, no closing note, the v1.5 START HERE screenshot (sidebar says Version 1.5, 39 activities) with no caption.
- [x] Computer: "Download the course to a computer", "Unzip it and open START HERE.", button "Download the course · 116 MB" (no language in the button; size changes per language). Downloads straight away, no new tab.
- [x] Android: "Install the app on the learners' phones or tablets", "Install it and choose English. On iPhone or iPad? Use it online.", button "Download the app · 3 MB" from the `app-latest` release, link "See the install steps with pictures" → `/courses/ai-literacy-for-everyone/install-android`.
- [x] Learning platform: "Upload the course to your platform", "Add the ZIP as an HTML package. On Kolibri? See how: computer · Android.", the ZIP button, and the two Kolibri links open the right Google Docs in a new tab. Both docs are viewable without signing in.
- [x] Online: "Share the link with learners", "Nothing to install. Needs internet.", button "Open the course" (arrow icon) → `/course/online/<language>/`.
- [x] After the plan card the page goes straight to Common questions; there is no "All the files" section.

**Every button, every language** (switch through all 9)
- [x] Teacher guide PDF and Word are the guide, in that language, 4 pages (5 in Hindi and Urdu), no heading stranded at the bottom of a page, no version number inside.
- [x] Slides PDF and PowerPoint are the slides in that language.
- [x] Worksheet PDF and Word, and the filled-in example PDF, are the right documents in that language; each worksheet is 1 page.
- [x] The ZIP's size matches the label and its SHA-256 matches `course/downloads.json`.
- [x] "Open in Google Drive" opens that language's video folder, viewable without signing in, with 25 videos.
- [x] No button is greyed out "Coming soon".
- [x] Downloads (ZIP, APK, EXE, Google exports) do not open a new tab; pages (Drive, YouTube, Kolibri docs, neuropocket.com) do.
- [x] NeuroPocket buttons point at the 1.8.0 release and the APK/EXE exist.

## C8. The course itself

**Computer ZIP** (English fully; spot-check Arabic or Urdu and one Swahili)
- [ ] Unzipped and served from a local server, START HERE.html opens in Chrome, Edge and Firefox and makes no request to any outside host (every request is to the local folder).
- [x] The lessons are listed on the left, "Start the course" on the right, matching the website screenshot.
- [x] Lesson 1 plays its videos in order with captions; AI or Not works; the recap quiz gives a score. Lessons 2 to 4 the same.
- [ ] NeuroPocket opens from the course and trains with the built-in pictures.
- [x] The worksheet app keeps what was typed after closing and reopening. Progress is remembered.
- [x] Resources contains the guide, slides, worksheet and example in that language.
- [x] Arabic and Urdu are right-to-left, including inside the quizzes and the worksheet app.
- [ ] The ZIP is a plain HTML package with START HERE.html at the top level, the shape a learning platform expects.

**Android app**
- [x] The APK downloads from `app-latest`. The `course-latest` pointer the app reads points at v1.5 with the right sizes and hashes.

**Online kit** `/course/online/<language>/`
- [x] All 9 addresses load, with and without the trailing slash.
- [x] All 225 videos in the `course-videos-v1.5` release are reachable; captions show.
- [x] Quizzes, AI or Not, worksheet app and NeuroPocket work inside it. Progress is remembered on reload.
- [x] Arabic and Urdu are right-to-left.
- [x] At phone width the sidebar opens and closes and videos fit the width.
- [x] No link inside the online kit points at a local file that only exists in the ZIP.

**Mini-app pages**
- [x] `/courses/ai-literacy-for-everyone/ai-or-not` shows the game inside the site layout; the frame grows with the content (no inner scrollbar, no cut-off bottom).
- [x] `recap-quiz-1` to `recap-quiz-4` show the right lesson's quiz. Finishing a quiz, the frame resizes to show the result.
- [x] `?lang=fr` (and ar, ur, sw, hi, pt, es) switches the language; `?lang=ar` is right-to-left.

**Install steps page** `/courses/ai-literacy-for-everyone/install-android`
- [ ] "← AI Literacy for Everyone" goes back to the course page's Get the course section.
- [x] Eight steps, each with a tall phone screenshot and short text; pictures load (first two straight away, the rest on scroll).
- [ ] Step 1's "Download the app" downloads the APK. The sizes quoted ("120 to 200 MB") match the real package sizes. The last line says Android only.
- [x] At phone width the picture is above the text and the page is not wider than the screen.

## C9. Introduction to Generative AI `/curriculum/intro-to-generative-ai`

- [x] The yellow banner reads exactly: "This course is currently being renovated. Content and resources may be updated. If you'd like to sign up as an early tester for our latest changes, contact us at contact@learnaianywhere.org." The email is a mailto link with the subject "Early tester".
- [x] Overview is open by default; the other sections open and close and the + / − flips.
- [x] The Google Slides embed loads and can be clicked through.
- [x] Lesson plan PowerPoint and PDF, worksheet PDF and Word, example PDF and Word all open the right document.
- [x] Setup → Android: Pocketpal (Play Store), SmolLM2 GGUF on Hugging Face (the link resolves; not downloaded), Kiwix (Play Store), Offline Encyclopedia (Drive file, shared with anyone).
- [x] Setup → Windows: Llamafile on Hugging Face (one file, no second download under it), Kiwix (Microsoft Store), Offline Encyclopedia.
- [x] Wording says "this course", not "this curriculum". Both Contact buttons → `/contact`.
- [x] At phone width the slides embed fits and the section headers are tappable.

## C10. About Us `/about`

- [x] Opening paragraph about the three gaps, with the ITU, UNESCO IITE PDF and UNESCO 2020 links in new tabs. Second paragraph "So we started Learn AI Anywhere and built a course to address all three...".
- [x] Uganda photo loads with its caption (Michael from Future Upgrade, ChatGPT on his phone, what inspired the offline-first course).
- [x] "Today we have learners in 80 countries across the world:" with the same map as the home page.
- [x] The handwritten learner note shows with its intro line.
- [x] "Teachers tell us the same. A school principal, after going through our course:" then the video in a framed box with the poster showing; the video is not downloaded before play (preload none).
- [x] The captions file is anonymised: the name is replaced by "[He gives his name.]" and the school by "I'm the principal of a school." Nothing on the page names the principal or the school.
- [x] "Video edited by Leah Sugg and Gabrielle Augier." under the video.
- [ ] Gallery: 12 pictures; clicking opens a large view with the caption; × closes, clicking outside closes, Esc closes.
- [x] Partner logos: Kiwix, Future Upgrade, Learning Equality, Learning Passport, AI Literacy Day, OLI. Each opens its site in a new tab; no logo is stretched.
- [x] Contact Us button at the bottom.

## C11. Get Involved, Contact, Donate

- [x] Get Involved: Volunteers tab open by default, Partnerships switches content, the active tab is highlighted. Teachers, Translators, Ambassadors cards; Teachers has four bullets. Contact Us button.
- [x] Contact: email contact@learnaianywhere.org shown; Copy Email copies it and the toast shows and disappears on its own (desktop). The "What to Include" list shows.
- [x] Donate: the DonorBox form loads inside the page, tall enough with no inner scrollbar, with amount buttons and the card form visible. Leaving and coming back still loads the form. The classroom photo and caption show.

## C12. Accessibility, layout and speed

- [ ] Every page at phone width (375) and tablet width (768): no sideways scrolling, nothing cut off, body text at least 16px.
- [x] Browser zoom at 200% on a laptop: the layout still works.
- [ ] Keyboard only: Tab reaches every link and button in a sensible order, a visible focus ring shows, Enter activates, Esc closes the gallery modal.
- [x] Every image has sensible alt text (the trailer cover is deliberately empty alt because the button has its own label).
- [x] Colour contrast: the green note, the grey "To teach with" labels and the muted step text pass.
- [x] Dark mode: nothing becomes unreadable (the site is designed light).
- [x] Pictures lower on the course page load only when scrolled to.
- [x] Content accuracy: every number on the course page matches reality (4 lessons, 25 videos, 1-page worksheet, 8 languages, version 1.5 and its date, 3 MB app, ZIP sizes, NeuroPocket 1.8.0). Nothing says "kit", "students", "class" or "classroom" where you wanted "course", "learners", "group". Nothing refers to things no longer on the page.

## C13. After the merge

- [ ] On the live site https://learnaianywhere.org repeat C2, C3, C4, C6, C7 (English only) and C8's online kit (one language).
- [ ] Nothing on the live site points at the deploy preview address.
- [ ] The old world-map PNG and the old pages are gone from the live site.

import React, { useState } from 'react';
import downloads from '../../course/downloads.json';
import './AILiteracyForEveryone.css';
import trailerCover from '../assets/images/ai-literacy/trailer-cover.jpg';
import startHereImg from '../assets/images/ai-literacy/start-here.jpg';
import teacherGuideImg from '../assets/images/ai-literacy/teacher-guide.jpg';
import slidesImg from '../assets/images/ai-literacy/slides.jpg';
import worksheetImg from '../assets/images/ai-literacy/worksheet.jpg';
import lessonVideoImg from '../assets/images/ai-literacy/lesson-video.jpg';
import worksheetAppImg from '../assets/images/ai-literacy/worksheet-app.jpg';
import neuropocketImg from '../assets/images/ai-literacy/neuropocket.jpg';
import aiOrNotImg from '../assets/images/ai-literacy/lesson-1-ai-or-not.jpg';
import describerDrawerImg from '../assets/images/ai-literacy/lesson-3-describer-drawer.jpg';
import biasChallengeImg from '../assets/images/ai-literacy/lesson-4-bias-challenge.jpg';

// The course page. Zip links and sizes come from course/downloads.json, which
// scripts/build_course.py writes on each release; a package's single files come
// from its "resources" (Google Drive links), once the build adds them.
//
// The page asks two questions (how will you use it, where will learners use
// it) and turns the answers into a short numbered plan, so a teacher is told
// what to download and what to do first instead of being shown every option.

const APP_URL = 'https://github.com/ousecTic/learnaianywhere/releases/download/app-latest/ai-literacy.apk';
const APP_MB = 3;
// The online kit: course/online/<package>/index.html, put into the site by
// scripts/build-online.mjs. Set this to null to hide everything that points to it.
const ONLINE_URL = (packageId) => `/course/online/${packageId}/`;
const INSTALL_STEPS_URL = '/courses/ai-literacy-for-everyone/install-android';
// The trailer, as a plain MP4 on the "site-media" GitHub release so it plays on
// the first click (a Drive embed needs a second click on its own play button).
// If the file can't be played, the Drive player is shown instead.
const TRAILER_MP4 = 'https://github.com/ousecTic/learnaianywhere/releases/download/site-media/course-trailer.mp4';
const TRAILER_EMBED = 'https://drive.google.com/file/d/1vitkG1eQ_6ks_EDyIg_ko6OfzTPrfg2i/preview';
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=tchN4xa4pfg';
// How to add the course in Kolibri, on a computer and on Android.
const KOLIBRI = {
  computer: 'https://docs.google.com/document/d/10xXu_L2pvKAAREcTpuIpC9y6eGcPKi1L_rVNcicWPOg/edit?usp=sharing',
  android: 'https://docs.google.com/document/d/1y9YVa08yoA3LaydCHUS5YfOz9vvb5bnPkW4U_111QBk/edit?usp=sharing',
};
const NEUROPOCKET = {
  android: 'https://github.com/ousecTic/neuropocket/releases/download/v1.8.0/neuropocket-android.apk',
  windows: 'https://github.com/ousecTic/neuropocket/releases/download/v1.8.0/neuropocket-windows.exe',
  online: 'https://neuropocket.com',
};
const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-sa/4.0/';

// Each language as it's shown in the menu, in the order of course/settings.json.
const LANG_LABELS = {
  en: 'English',
  fr: 'Français (French)',
  es: 'Español (Spanish)',
  pt: 'Português (Portuguese)',
  ar: 'العربية (Arabic)',
  hi: 'हिन्दी (Hindi)',
  ur: 'اردو (Urdu)',
  'sw-KE': 'Kiswahili – Kenya (Swahili)',
  'sw-TZ': 'Kiswahili – Tanzania (Swahili)',
};

const INSIDE = [
  { img: teacherGuideImg, alt: 'The first page of the teacher guide', who: 'To teach with', title: 'Teacher guide', text: 'How the course is set up, how each lesson runs, and what learners should be able to do by the end.', page: true },
  { img: slidesImg, alt: 'A slide from the course', who: 'To teach with', title: 'Slides', text: 'For all 4 lessons, each with a recap quiz and then project time. Show them or print them.' },
  { img: worksheetImg, alt: 'The Design Your Own AI Classifier worksheet', who: 'To learn with', title: 'Worksheet', text: 'A 1-page project that builds across the 4 lessons, with a filled-in example.', page: true },
  { img: lessonVideoImg, alt: 'A lesson video', who: 'To learn with', title: '26 short videos', text: 'Every idea in the course, explained in a few minutes each, with captions. Show them to the group or let learners watch on their own.' },
  { img: worksheetAppImg, alt: 'The worksheet app, Lesson 1', who: 'To learn with', title: 'Games and quizzes', text: 'The AI or Not game, a recap quiz after each lesson, and the worksheet to fill in on screen.' },
  { img: neuropocketImg, alt: 'The NeuroPocket app', who: 'To learn with', title: 'NeuroPocket app', text: 'Learners train their own AI, with pictures that come with the app or their own. One device per group is enough.' },
];

const LESSONS = [
  { n: 1, title: 'What is AI?', time: '25–30 min', img: aiOrNotImg, activity: 'AI or Not game', videos: 4,
    objectives: ['Explain the key qualities that make something AI', 'Sort examples into AI and not AI, and say why'] },
  { n: 2, title: 'The key parts of machine learning', time: '25–30 min', img: neuropocketImg, activity: 'Train a model in NeuroPocket', videos: 5,
    objectives: ['Explain what machine learning is', 'Name its key parts and what each one does', 'Explain how data affects how well AI works'] },
  { n: 3, title: 'How do machines train?', time: '30–40 min', img: describerDrawerImg, activity: 'Describer Drawer game', videos: 7,
    objectives: ['Explain what an algorithm is, with real-life examples', 'Explain why machines need algorithms', 'Describe the steps a machine follows in training', 'Compare how people and machines process information'] },
  { n: 4, title: 'Can machines be responsible?', time: '30–40 min', img: biasChallengeImg, activity: 'Bias challenge in NeuroPocket', videos: 7,
    objectives: ['Explain how biased data leads to wrong predictions', 'Explain why people are responsible for AI, and how to reduce harm', 'Name simple ways to protect people’s privacy', 'Connect bias, privacy and responsibility to responsible AI'] },
];

const MODES = [
  { id: 'teach', title: 'I’ll teach it', sub: 'You run the lessons from the slides. One screen for the group and a device per small group is enough.', icon: 'teacher' },
  { id: 'self', title: 'Learners go through it on their own', sub: 'Videos, games and quizzes, at their own pace, on any device.', icon: 'learners' },
];

const DEVICES = [
  { id: 'computer', title: 'On a computer', sub: 'Windows, Mac or Linux', icon: 'computer' },
  { id: 'android', title: 'Android phone or tablet', sub: 'As an app', icon: 'phone' },
  { id: 'online', title: 'Online', sub: 'Any device, needs internet', icon: 'globe', online: true },
  { id: 'platform', title: 'Moodle or another platform', sub: 'Kolibri, Google Classroom…', icon: 'school' },
];

const ICONS = {
  download: <><path d="M12 4v11" /><path d="M7 10l5 5 5-5" /><path d="M5 20h14" /></>,
  computer: <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8" /><path d="M12 16v4" /></>,
  phone: <><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M10.5 18.5h3" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></>,
  school: <><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /></>,
  teacher: <><circle cx="12" cy="7" r="3.5" /><path d="M5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2" /></>,
  learners: <><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><path d="M2 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" /><path d="M14 15h2a4 4 0 0 1 4 4v1" /></>,
  arrow: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
  play: <path d="M8 5v14l11-7z" fill="currentColor" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  offline: <><path d="M4 9a12 12 0 0 1 16 0" /><path d="M7.5 12.5a7 7 0 0 1 9 0" /><circle cx="12" cy="16.5" r="1.2" fill="currentColor" /><path d="M3 3l18 18" /></>,
  check: <path d="M5 12l5 5 9-10" />,
  chevron: <path d="M6 9l6 6 6-6" />,
};

const Icon = ({ name, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

const megabytes = (bytes) => `${Math.round(bytes / 1e6)} MB`;

const formatDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// A Google export link (a file download), labelled with its size when it's big
// enough to matter on a slow connection. A link the build hasn't added yet gives
// a button that shows but can't be pressed.
const file = (label, link) => [link && link.bytes > 5e6 ? `${label} · ${megabytes(link.bytes)}` : label, link && link.url];

// Pages open in a new tab; downloads (zips, apps, Google exports) don't need one.
const external = (url) => /^https?:/.test(url) && !/\.(zip|apk|exe)$|\/export(\/|\?)/.test(url);

const linkProps = (url) => (external(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {});

const FileButton = ({ label, url, primary }) => (url
  ? <a className={primary ? 'alfe-file-btn is-primary' : 'alfe-file-btn'} href={url} {...linkProps(url)}>{primary && <Icon name="download" size={16} />}{label}</a>
  : <span className="alfe-file-btn is-pending" aria-disabled="true" title="Coming soon">{label}</span>);

const StepHead = ({ n, children }) => (
  <div className="alfe-step-head">
    <span className="alfe-step-num" aria-hidden="true">{n}</span>
    <h3>{children}</h3>
  </div>
);

// The teacher's materials for one package, as rows of download buttons.
const materialRows = (pkg) => {
  const r = pkg.resources || {};
  const english = pkg.lang === 'en';
  return [
    { name: 'Teacher guide', what: 'How the course is set up and how each lesson runs. Read this first.', buttons: [file('PDF', r.guidePdf), file('Word', r.guideDocx)] },
    { name: 'Slides', what: 'For all 4 lessons, each with a recap quiz and then project time.', buttons: [file('PDF', r.slidesPdf), file('PowerPoint', r.slidesPptx)] },
    { name: 'Worksheet', what: 'A 1-page project that builds across the 4 lessons.', buttons: [file('PDF', r.worksheetPdf), file('Word', r.worksheetDocx)] },
    { name: 'Worksheet example', what: 'Filled in, to show learners what to aim for.', buttons: [file('PDF', r.examplePdf), file('Word', r.exampleDocx)] },
    {
      name: 'Lesson videos',
      what: `All 26 videos, with captions, in each lesson’s folder. They’re also inside the course download.${english ? '' : ' On YouTube they are in English only.'}`,
      buttons: [['Open in Google Drive', r.videosFolder && r.videosFolder.url], [english ? 'Watch on YouTube' : 'Watch in English on YouTube', YOUTUBE_URL]],
    },
    { name: 'NeuroPocket app', what: 'Learners train their own AI with pictures that come with the app, or their own.', buttons: [['Android app', NEUROPOCKET.android], ['Windows app', NEUROPOCKET.windows], ['Online at neuropocket.com', NEUROPOCKET.online]] },
  ];
};

// The plan for one set of answers: a few numbered steps, each with its own
// buttons, and a closing note that points at the other way of using the course.
const makePlan = ({ mode, device, pkg, onlineUrl, openFiles }) => {
  const r = pkg.resources || {};
  const lang = pkg.name;
  const guide = { h: 'Read the teacher guide', p: 'How the course is set up, how each lesson splits into lesson time and project time, and what learners should be able to do by the end.', buttons: [file('PDF', r.guidePdf), file('Word', r.guideDocx)] };
  const slides = { h: 'Get the slides', p: 'One deck for all 4 lessons. Each lesson teaches the ideas, then has a recap quiz, then project time. Show them on a screen or print them.', buttons: [file('PDF', r.slidesPdf), file('PowerPoint', r.slidesPptx)] };
  const worksheet = { h: 'Print the worksheet', p: 'A 1-page project learners build up over the 4 lessons. Plain paper works too. There is a filled-in example to check against.', buttons: [file('Worksheet (PDF)', r.worksheetPdf), file('Worksheet (Word)', r.worksheetDocx), file('Filled-in example (PDF)', r.examplePdf)] };
  const neuropocket = { h: 'Put NeuroPocket on one device per group', p: 'Learners train their own AI with pictures that come with the app, or their own if the device has a camera. The apps work offline once installed.', buttons: [['Android app', NEUROPOCKET.android], ['Windows app', NEUROPOCKET.windows], ['Online at neuropocket.com', NEUROPOCKET.online]] };

  if (mode === 'teach') {
    return {
      title: `Teach it yourself, in ${lang}`,
      steps: [guide, slides, worksheet, neuropocket, { h: 'Start teaching the first lesson', p: 'Each lesson has a lesson part, taught from the slides, then project time, when learners work on the worksheet and their own AI.' }],
      pic: { img: slidesImg, alt: 'A slide from the course', what: 'You teach from these slides: one deck for all 4 lessons, each with its recap quiz and project time.' },
      note: <>Want to see how we teach it? About an hour of lesson videos covers the same ideas. Watch them to prepare, or play them to the group. {onlineUrl && <><a href={onlineUrl}>Watch the videos online</a> or </>}<a href="#materials" onClick={openFiles}>download them</a>.</>,
    };
  }

  const zip = ['Download the course', `${lang} · ${megabytes(pkg.bytes)}`, pkg.url];
  let get; let open; let what;
  if (device === 'android') {
    get = { h: 'Install the app on the learners’ phones or tablets', p: <>Open the file, tap <strong>Install</strong>, then choose <strong>{lang}</strong>. The app downloads the course once, while you still have internet. iPhone or iPad? Use it online instead.</>, big: ['Download the app', `${APP_MB} MB`, APP_URL], more: INSTALL_STEPS_URL && <a href={INSTALL_STEPS_URL}>See the install steps with pictures</a> };
    open = { h: 'Learners open the app and tap Lesson 1', p: 'The videos, games and quizzes come in order. The app remembers where they got to.' };
    what = 'This is what the app shows: the 4 lessons, with progress saved. The teacher materials are under Resources.';
  } else if (device === 'online') {
    get = { h: 'Share the link with learners', p: 'Nothing to install. Needs internet the whole time.', big: ['Open the course', lang, onlineUrl] };
    open = { h: 'Learners open the link and start Lesson 1', p: 'The videos, games and quizzes come in order. The browser remembers where they got to.' };
    what = 'This is what the link opens: the 4 lessons, with progress saved. The teacher materials are under Resources.';
  } else if (device === 'platform') {
    get = { h: 'Upload the course to your platform', p: <>Download the ZIP and add it to your course as an HTML package, the way you would add any web activity. Already on Kolibri? The course is in the Kolibri library: see how to add it <a href={KOLIBRI.computer} target="_blank" rel="noopener noreferrer">on a computer</a> or <a href={KOLIBRI.android} target="_blank" rel="noopener noreferrer">on Android</a>.</>, big: zip };
    open = { h: 'Learners open it from your course page and start Lesson 1', p: 'The videos, games and quizzes come in order, inside your platform.' };
    what = 'This is what learners see inside your platform: the 4 lessons, with progress saved. The teacher materials are under Resources.';
  } else {
    get = { h: 'Download the course to a computer', p: <>Unzip it and open <strong>START HERE</strong>. Copy the folder to other computers with a USB stick.</>, big: zip };
    open = { h: 'Learners open START HERE and start Lesson 1', p: 'The videos, games and quizzes come in order. It remembers where they got to.' };
    what = 'This is START HERE, what opens on the computer: the 4 lessons, with progress saved. The teacher materials are under Resources.';
  }
  return {
    title: `Learners go through it on their own, in ${lang}`,
    steps: [get, open, { h: 'Optional: print the worksheet', p: 'It is already inside the course, filled in on screen. Print it if you would rather have paper.', buttons: [file('Worksheet (PDF)', r.worksheetPdf)] }],
    pic: { img: startHereImg, alt: 'The START HERE page: the lessons listed on the left, a Start the course button on the right', what },
    note: <>Want to teach some of it yourself? The teacher guide and slides are in the <a href="#materials" onClick={openFiles}>list at the bottom of this page</a>.</>,
  };
};

const AILiteracyForEveryone = () => {
  const packages = downloads.packages;
  const [langId, setLangId] = useState(packages[0].id);
  const [langChanged, setLangChanged] = useState(false);
  const [mode, setMode] = useState('teach');
  const [device, setDevice] = useState('computer');
  const [trailer, setTrailer] = useState('off'); // 'off' | 'video' | 'embed'
  const [openLesson, setOpenLesson] = useState(null);
  const [filesOpen, setFilesOpen] = useState(false);
  const openFiles = () => setFilesOpen(true);
  const pkg = packages.find((p) => p.id === langId) || packages[0];
  const onlineUrl = ONLINE_URL ? ONLINE_URL(pkg.id) : null;
  const devices = DEVICES.filter((d) => !d.online || onlineUrl);
  const plan = makePlan({ mode, device, pkg, onlineUrl, openFiles });
  const askDevice = mode === 'self';

  const pickLang = (e) => {
    setLangId(e.target.value);
    setLangChanged(true);
  };
  const langOptions = packages.map((p) => <option key={p.id} value={p.id}>{LANG_LABELS[p.id] || p.name}</option>);

  return (
    <div className="alfe">
      {/* Hero */}
      <section className="alfe-hero">
        <div className="alfe-wrap alfe-hero-grid">
          <div className="alfe-hero-text">
            <p className="alfe-eyebrow">Free course · Ages 11 and up · 8 languages</p>
            <h1>AI Literacy for Everyone</h1>
            <p className="alfe-lead">A 4-lesson course on how AI works. Learners train their own AI and learn to use it responsibly, with or without internet.</p>
            <div className="alfe-hero-actions">
              {onlineUrl && <a href={onlineUrl} className="alfe-btn alfe-btn-primary"><Icon name="globe" size={18} />Try it online now</a>}
              <a href="#get" className={onlineUrl ? 'alfe-btn alfe-btn-outline' : 'alfe-btn alfe-btn-primary'}><Icon name="download" size={18} />Get the course</a>
            </div>
            <p className="alfe-hero-note">In English here. Other languages are under <a href="#get">Get the course</a>.</p>
          </div>
          <div className="alfe-hero-photo">
            {trailer === 'video' && (
              <video src={TRAILER_MP4} poster={trailerCover} autoPlay controls playsInline onError={() => setTrailer('embed')} />
            )}
            {trailer === 'embed' && (
              <iframe src={TRAILER_EMBED} title="AI Literacy for Everyone trailer" allow="autoplay; fullscreen" allowFullScreen />
            )}
            {trailer === 'off' && (
              <button type="button" className="alfe-trailer" onClick={() => setTrailer('video')} aria-label="Watch the trailer">
                <img src={trailerCover} alt="" />
                <span className="alfe-play">
                  <span className="alfe-play-icon"><Icon name="play" size={14} /></span>
                  {pkg.lang === 'en' ? 'Watch the trailer' : 'Watch the trailer (English)'}
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* What's in the course */}
      <section id="inside" className="alfe-section alfe-tinted" aria-labelledby="inside-h">
        <div className="alfe-wrap">
          <h2 id="inside-h">What’s in the course</h2>
          <p className="alfe-section-lead">Use all of it, or only the parts you need.</p>
          <div className="alfe-kit">
            {INSIDE.map((k) => (
              <div className="alfe-kit-card" key={k.title}>
                <div className={k.page ? 'alfe-kit-img is-page' : 'alfe-kit-img'}>
                  <img src={k.img} alt={k.alt} loading="lazy" />
                </div>
                <div className="alfe-kit-text">
                  <p className="alfe-who">{k.who}</p>
                  <h3>{k.title}</h3>
                  <p>{k.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section className="alfe-section" aria-labelledby="lessons-h">
        <div className="alfe-wrap">
          <h2 id="lessons-h">The 4 lessons</h2>
          <p className="alfe-section-lead">The course is flexible: teach all 4 lessons in a day, or one a day and finish in a week.</p>
          <div className="alfe-lessons">
            {LESSONS.map((l) => {
              const open = openLesson === l.n;
              return (
                <article className={open ? 'alfe-lesson is-open' : 'alfe-lesson'} key={l.n}>
                  <h3 className="alfe-lesson-title">
                    <button type="button" aria-expanded={open} aria-controls={`alfe-lesson-${l.n}`} onClick={() => setOpenLesson(open ? null : l.n)}>
                      <span className="alfe-lesson-name"><span className="alfe-lesson-n">Lesson {l.n}.</span> {l.title}</span>
                      <span className="alfe-lesson-time"><Icon name="clock" size={15} />{l.time}</span>
                      <span className="alfe-toggle" aria-hidden="true"><Icon name="chevron" size={20} /></span>
                    </button>
                  </h3>
                  {open && (
                    <div className="alfe-lesson-body" id={`alfe-lesson-${l.n}`}>
                      <div className="alfe-lesson-img"><img src={l.img} alt={`Lesson ${l.n}: ${l.activity}`} loading="lazy" /></div>
                      <div className="alfe-lesson-text">
                        <p className="alfe-lesson-will">Learners will:</p>
                        <ul>
                          {l.objectives.map((o) => <li key={o}>{o}</li>)}
                        </ul>
                        <div className="alfe-tags">
                          {['Slides', `${l.videos} short videos`, l.activity, 'Recap quiz', `Worksheet part ${l.n}`].map((t) => <span key={t}>{t}</span>)}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Get the course: two questions, then a plan */}
      <section id="get" className="alfe-section alfe-download" aria-labelledby="get-h">
        <div className="alfe-wrap alfe-narrow">
          <div className="alfe-dl-top">
            <div>
              <h2 id="get-h">Get the course in {pkg.name}</h2>
              <p className="alfe-dl-meta">Version {downloads.version} · {formatDate(pkg.date)} · Free</p>
            </div>
            <div className="alfe-lang">
              <label htmlFor="alfe-lang">Language</label>
              <select id="alfe-lang" value={langId} onChange={pickLang}>{langOptions}</select>
            </div>
          </div>
          <p className="alfe-dl-lead">Answer two questions and we’ll show you exactly what to download and what to do first.</p>
          {langChanged && (
            <p className="alfe-lang-note" role="status"><Icon name="check" size={20} />Switched to {pkg.name}. Everything below, and all the files, are now in {pkg.name}.</p>
          )}

          <div className="alfe-card">
            <StepHead n={1}>How do you want to use it?</StepHead>
            <div className="alfe-devices alfe-modes">
              {MODES.map((m) => (
                <button type="button" key={m.id} className={mode === m.id ? 'alfe-device is-on' : 'alfe-device'} aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>
                  <span className="alfe-device-icon"><Icon name={m.icon} size={24} /></span>
                  <span className="alfe-device-text"><strong>{m.title}</strong><span>{m.sub}</span></span>
                </button>
              ))}
            </div>
          </div>

          {askDevice && (
            <div className="alfe-card">
              <StepHead n={2}>Where will learners use it?</StepHead>
              <div className="alfe-devices">
                {devices.map((d) => (
                  <button type="button" key={d.id} className={device === d.id ? 'alfe-device is-on' : 'alfe-device'} aria-pressed={device === d.id} onClick={() => setDevice(d.id)}>
                    <span className="alfe-device-icon"><Icon name={d.icon} size={24} /></span>
                    <span className="alfe-device-text"><strong>{d.title}</strong><span>{d.sub}</span></span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="alfe-card alfe-plan">
            <div className="alfe-plan-text">
              <p className="alfe-eyebrow">Your plan</p>
              <h3 className="alfe-plan-title">{plan.title}</h3>
              <ol className="alfe-steps">
                {plan.steps.map((s, i) => (
                  <li key={s.h}>
                    <span className="alfe-step-small" aria-hidden="true">{i + 1}</span>
                    <div className="alfe-step-body">
                      <h4>{s.h}</h4>
                      <p>{s.p}</p>
                      {s.big && (
                        <a href={s.big[2]} className="alfe-btn alfe-btn-primary alfe-start" {...linkProps(s.big[2])}><Icon name={device === 'online' ? 'arrow' : 'download'} size={18} />{s.big[0]} <span className="alfe-btn-meta">· {s.big[1]}</span></a>
                      )}
                      {s.more}
                      {s.buttons && (
                        <div className="alfe-file-btns">
                          {s.buttons.map(([label, url]) => <FileButton key={label} label={label} url={url} />)}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
              <p className="alfe-plan-note">{plan.note}</p>
            </div>
            <figure className="alfe-plan-pic">
              <div className="alfe-plan-shot"><img src={plan.pic.img} alt={plan.pic.alt} loading="lazy" /></div>
              <figcaption>{plan.pic.what}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* All the files, one by one */}
      <section id="materials" className="alfe-section" aria-labelledby="mat-h">
        <div className="alfe-wrap alfe-narrow alfe-files">
          <h2 id="mat-h">All the files, in {pkg.name}</h2>
          <p className="alfe-section-lead">Every file in the course, one by one, if you’d rather not answer the questions above.</p>
          <button type="button" className="alfe-btn alfe-btn-outline alfe-start" aria-expanded={filesOpen} aria-controls="alfe-files-all" onClick={() => setFilesOpen((o) => !o)}>
            <span className={filesOpen ? 'alfe-toggle is-open' : 'alfe-toggle'}><Icon name="chevron" size={18} /></span>{filesOpen ? 'Hide the files' : 'Show all the files'}
          </button>
          {filesOpen && <div id="alfe-files-all" className="alfe-files-all">

          <h3>To teach with</h3>
          <p className="alfe-muted">PDF to print, Word and PowerPoint to edit. These are also inside the course download, under Resources.</p>
          <div className="alfe-files-list">
            {materialRows(pkg).map((row) => (
              <div className="alfe-file-row" key={row.name}>
                <div className="alfe-file-name">
                  <strong>{row.name}</strong>
                  {row.what && <span>{row.what}</span>}
                </div>
                <div className="alfe-file-btns">
                  {row.buttons.map(([label, url]) => <FileButton key={label} label={label} url={url} />)}
                </div>
              </div>
            ))}
          </div>

          <h3>The course to learn with</h3>
          <p className="alfe-muted">The videos, games, quizzes and NeuroPocket together. Pick the one that fits the device.</p>
          <div className="alfe-files-list">
            <div className="alfe-file-row">
              <div className="alfe-file-name"><strong>For a computer</strong><span>A ZIP with everything. Unzip it and open START HERE. Windows, Mac or Linux.</span></div>
              <div className="alfe-file-btns"><FileButton label={`Download · ${megabytes(pkg.bytes)}`} url={pkg.url} /></div>
            </div>
            <div className="alfe-file-row">
              <div className="alfe-file-name"><strong>For Android phones and tablets</strong><span>A small app that downloads the course in your language once, then works offline.</span></div>
              <div className="alfe-file-btns"><FileButton label={`Download the app · ${APP_MB} MB`} url={APP_URL} />{INSTALL_STEPS_URL && <FileButton label="Install steps" url={INSTALL_STEPS_URL} />}</div>
            </div>
            {onlineUrl && (
              <div className="alfe-file-row">
                <div className="alfe-file-name"><strong>Online</strong><span>The same course in a browser. Nothing to install, needs internet.</span></div>
                <div className="alfe-file-btns"><FileButton label={`Open the course in ${pkg.name}`} url={onlineUrl} /></div>
              </div>
            )}
            <div className="alfe-file-row">
              <div className="alfe-file-name"><strong>On Kolibri</strong><span>The course is in the Kolibri library, for anyone who already uses it. How to add it:</span></div>
              <div className="alfe-file-btns"><FileButton label="On a computer" url={KOLIBRI.computer} /><FileButton label="On Android" url={KOLIBRI.android} /></div>
            </div>
          </div>
          </div>}
        </div>
      </section>

      {/* Common questions */}
      <section className="alfe-section alfe-tinted" aria-labelledby="faq-h">
        <div className="alfe-wrap alfe-narrow">
          <h2 id="faq-h">Common questions</h2>
          <div className="alfe-faq">
            <div className="alfe-faq-item">
              <h3>Do I need internet to teach it?</h3>
              <p>Only once. On a computer, to download the course. On a phone, the first time you open the app. After that, everything works offline. You can copy the folder to other computers with a USB stick, so one download can serve a whole school or centre.</p>
            </div>
            <div className="alfe-faq-item">
              <h3>Do I need to know about AI already?</h3>
              <p>No. The teacher guide walks you through each lesson, and the videos explain every idea in plain words. Many teachers watch the videos first to prepare.</p>
            </div>
            <div className="alfe-faq-item">
              <h3>Does every learner need a device?</h3>
              <p>No. The activities are made to be done in groups, so one device per group is enough, and everyone can watch the slides or videos on one screen. The worksheet can be done on paper.</p>
            </div>
            <div className="alfe-faq-item">
              <h3>Can one person take it alone?</h3>
              <p>Yes. The whole course works for one person with one device: the videos, games, quizzes and NeuroPocket, and the worksheet on screen or on paper. Nobody needs to teach it.</p>
            </div>
            <div className="alfe-faq-item">
              <h3>Can I share or change it?</h3>
              <p>Yes. The course is under a <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer">CC BY-NC-SA</a> licence: share it and adapt it for your group, credit Learn AI Anywhere, don’t sell it, and share your changes the same way.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AILiteracyForEveryone;

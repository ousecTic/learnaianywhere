import React, { useState } from 'react';
import downloads from '../../course/downloads.json';
import './AILiteracyForEveryone.css';
import trailerCover from '../assets/images/ai-literacy/trailer-cover.jpg';
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

const APP_URL = 'https://github.com/ousecTic/learnaianywhere/releases/download/app-latest/ai-literacy.apk';
const APP_MB = 3;
// The online kit (plan step 7.6) and the Android install steps with pictures (7.5)
// aren't built yet. Until they are, everything that points to them stays hidden.
const ONLINE_URL = null; // e.g. (lang) => `/courses/ai-literacy-for-everyone/online/${lang}/`
const INSTALL_STEPS_URL = null;
const TRAILER_EMBED = 'https://drive.google.com/file/d/1vitkG1eQ_6ks_EDyIg_ko6OfzTPrfg2i/preview';
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=tchN4xa4pfg';
const KOLIBRI_URL = 'https://docs.google.com/document/d/10xXu_L2pvKAAREcTpuIpC9y6eGcPKi1L_rVNcicWPOg/edit?usp=sharing';
const NEUROPOCKET = {
  android: 'https://github.com/ousecTic/neuropocket/releases/download/v1.8.0/neuropocket-android.apk',
  windows: 'https://github.com/ousecTic/neuropocket/releases/download/v1.8.0/neuropocket-windows.exe',
  browser: 'https://neuropocket.com',
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

const KIT = [
  { img: teacherGuideImg, alt: 'The first page of the teacher guide', title: 'Teacher guide', text: 'How to teach each lesson. Read this first.', page: true },
  { img: slidesImg, alt: 'A slide from the course', title: 'Slides', text: 'For all 4 lessons. Show them or print them.' },
  { img: worksheetImg, alt: 'The Design Your Own AI Classifier worksheet', title: 'Worksheet', text: 'A 1-page project, with a filled-in example.', page: true },
  { img: lessonVideoImg, alt: 'A lesson video', title: 'Lesson videos', text: '26 short videos that go with the lessons. Helpful for preparing or showing in class, but you can teach without them.' },
  { img: worksheetAppImg, alt: 'The worksheet app, Lesson 1', title: 'Recap quizzes and worksheet app', text: 'A quiz after each lesson, and the worksheet to fill in on screen instead of on paper.' },
  { img: neuropocketImg, alt: 'The NeuroPocket app', title: 'NeuroPocket app', text: 'Students train their own AI with a camera.' },
];

const LESSONS = [
  { n: 1, title: 'What is AI?', time: '25–30 minutes', img: aiOrNotImg, activity: 'AI or Not game', videos: 4,
    objectives: ['Explain the key qualities that make something AI', 'Sort examples into AI and not AI, and say why'] },
  { n: 2, title: 'The key parts of machine learning', time: '25–30 minutes', img: neuropocketImg, activity: 'Train a model in NeuroPocket', videos: 5,
    objectives: ['Explain what machine learning is', 'Name its key parts and what each one does', 'Explain how data affects how well AI works'] },
  { n: 3, title: 'How do machines train?', time: '30–40 minutes', img: describerDrawerImg, activity: 'Describer Drawer game', videos: 7,
    objectives: ['Explain what an algorithm is, with real-life examples', 'Explain why machines need algorithms', 'Describe the steps a machine follows in training', 'Compare how people and machines process information'] },
  { n: 4, title: 'Can machines be responsible?', time: '30–40 minutes', img: biasChallengeImg, activity: 'Bias challenge in NeuroPocket', videos: 7,
    objectives: ['Explain how biased data leads to wrong predictions', 'Explain why people are responsible for AI, and how to reduce harm', 'Name simple ways to protect people’s privacy', 'Connect bias, privacy and responsibility to responsible AI'] },
];

const DEVICES = [
  { id: 'computer', title: 'On a computer', sub: 'Windows, Mac or Linux', icon: 'computer' },
  { id: 'android', title: 'On an Android phone or tablet', sub: 'As an app', icon: 'phone' },
  { id: 'online', title: 'Online, without downloading', sub: 'Any device with internet', icon: 'globe', online: true },
];

const ICONS = {
  download: <><path d="M12 4v11" /><path d="M7 10l5 5 5-5" /><path d="M5 20h14" /></>,
  computer: <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8" /><path d="M12 16v4" /></>,
  phone: <><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M10.5 18.5h3" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></>,
  school: <><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /></>,
  arrow: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
  play: <path d="M8 5v14l11-7z" fill="currentColor" />,
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

// The single files for one package, in the order of the kit.
const resourceRows = (pkg) => {
  const r = pkg.resources || {};
  const english = pkg.lang === 'en';
  return [
    { name: 'Teacher guide', buttons: [file('PDF', r.guidePdf), file('Word', r.guideDocx)] },
    { name: 'Slides', what: 'Includes the recap quiz for each lesson.', buttons: [file('PDF', r.slidesPdf), file('PowerPoint', r.slidesPptx)] },
    { name: 'Worksheet', buttons: [file('PDF', r.worksheetPdf), file('Word', r.worksheetDocx)] },
    { name: 'Worksheet example', what: 'Filled in, to show students what to aim for.', buttons: [file('PDF', r.examplePdf), file('Word', r.exampleDocx)] },
    {
      name: 'Lesson videos',
      what: `All 26 videos, with captions, in each lesson’s folder. They’re also all inside the full kit download.${english ? '' : ' On YouTube they are in English only.'}`,
      buttons: [['Open in Google Drive', r.videosFolder && r.videosFolder.url], [english ? 'Watch on YouTube' : 'Watch in English on YouTube', YOUTUBE_URL]],
    },
    { name: 'NeuroPocket app', what: 'For Lessons 2 and 4', buttons: [['For Android phones', NEUROPOCKET.android], ['For Windows computers', NEUROPOCKET.windows], ['Use it in a browser', NEUROPOCKET.browser]] },
  ];
};

// Pages open in a new tab; downloads (zips, apps, Google exports) don't need one.
const external = (url) => /^https?:/.test(url) && !/\.(zip|apk|exe)$|\/export(\/|\?)/.test(url);

const ResourceButton = ({ label, url }) => (url
  ? <a className="alfe-file-btn" href={url} {...(external(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{label}</a>
  : <span className="alfe-file-btn is-pending" aria-disabled="true" title="Coming soon">{label}</span>);

const StepHead = ({ n, children, as: Tag = 'h3', htmlFor }) => (
  <div className="alfe-step-head">
    <span className="alfe-step-num" aria-hidden="true">{n}</span>
    {Tag === 'label' ? <label htmlFor={htmlFor}>{children}</label> : <Tag>{children}</Tag>}
  </div>
);

const AILiteracyForEveryone = () => {
  const packages = downloads.packages;
  const [langId, setLangId] = useState(packages[0].id);
  const [device, setDevice] = useState('computer');
  const [trailerOn, setTrailerOn] = useState(false);
  const [openLessons, setOpenLessons] = useState([1]);
  const toggleLesson = (n) => setOpenLessons((open) => (open.includes(n) ? open.filter((x) => x !== n) : [...open, n]));
  const pkg = packages.find((p) => p.id === langId) || packages[0];
  const onlineUrl = ONLINE_URL ? ONLINE_URL(pkg.id) : null;
  const devices = DEVICES.filter((d) => !d.online || onlineUrl);

  return (
    <div className="alfe">
      {/* Hero */}
      <section className="alfe-hero">
        <div className="alfe-wrap alfe-hero-grid">
          <div className="alfe-hero-text">
            <h1>AI Literacy for Everyone</h1>
            <p className="alfe-lead">A free teaching kit for ages 11 and up. Teach the basics of AI in 4 lessons. Download it once, then teach it anywhere, with or without internet.</p>
            <p className="alfe-langs">In English, French, Spanish, Portuguese, Arabic, Hindi, Urdu and Swahili.</p>
            <div className="alfe-hero-actions">
              <a href="#download" className="alfe-btn alfe-btn-primary"><Icon name="download" size={18} />Download the kit</a>
              {onlineUrl && <a href={onlineUrl} className="alfe-btn alfe-btn-outline"><Icon name="globe" size={18} />Try it online</a>}
            </div>
          </div>
          <div className="alfe-hero-photo">
            {trailerOn ? (
              <iframe src={TRAILER_EMBED} title="AI Literacy for Everyone trailer" allow="autoplay; fullscreen" allowFullScreen />
            ) : (
              <>
                <img src={trailerCover} alt="Students gathered around laptops in a classroom" />
                <button type="button" className="alfe-play" onClick={() => setTrailerOn(true)}>
                  <span className="alfe-play-icon"><Icon name="play" size={14} /></span>
                  {pkg.lang === 'en' ? 'Watch the trailer' : 'Watch the trailer (English)'}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* What's in the kit */}
      <section id="inside" className="alfe-section" aria-labelledby="inside-h">
        <div className="alfe-wrap">
          <h2 id="inside-h">What’s in the kit</h2>
          <div className="alfe-kit">
            {KIT.map((k) => (
              <div className="alfe-kit-card" key={k.title}>
                <div className={k.page ? 'alfe-kit-img is-page' : 'alfe-kit-img'}>
                  <img src={k.img} alt={k.alt} loading="lazy" />
                </div>
                <div className="alfe-kit-text">
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
          <p className="alfe-section-lead">Every lesson ends with a recap quiz and the next part of the worksheet.</p>
          <div className="alfe-lessons">
            {LESSONS.map((l) => {
              const open = openLessons.includes(l.n);
              return (
                <div className={open ? 'alfe-lesson is-open' : 'alfe-lesson'} key={l.n}>
                  <h3 className="alfe-lesson-title">
                    <button type="button" aria-expanded={open} aria-controls={`alfe-lesson-${l.n}`} onClick={() => toggleLesson(l.n)}>
                      <span className="alfe-lesson-num" aria-hidden="true">{l.n}</span>
                      <span className="alfe-lesson-name">
                        <span className="alfe-visually-hidden">Lesson {l.n}: </span>{l.title}
                        <span className="alfe-lesson-meta">{l.time}</span>
                      </span>
                      <span className="alfe-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
                    </button>
                  </h3>
                  {open && (
                    <div className="alfe-lesson-body" id={`alfe-lesson-${l.n}`}>
                      <div className="alfe-lesson-text">
                        <p className="alfe-lesson-will">Students will:</p>
                        <ul>
                          {l.objectives.map((o) => <li key={o}>{o}</li>)}
                        </ul>
                        <div className="alfe-lesson-includes">Slides · {l.videos} short videos · {l.activity} · Recap quiz</div>
                      </div>
                      <figure className="alfe-lesson-pic">
                        <div className="alfe-lesson-img"><img src={l.img} alt={`Lesson ${l.n}: ${l.activity}`} loading="lazy" /></div>
                      </figure>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="alfe-section alfe-download" aria-labelledby="dl-h">
        <div className="alfe-wrap alfe-narrow">
          <div className="alfe-dl-top">
            <h2 id="dl-h">Download the teaching kit</h2>
            <div className="alfe-lang">
              <label htmlFor="alfe-lang">Language</label>
              <select id="alfe-lang" value={langId} onChange={(e) => setLangId(e.target.value)}>
                {packages.map((p) => <option key={p.id} value={p.id}>{LANG_LABELS[p.id] || p.name}</option>)}
              </select>
            </div>
          </div>
          <p className="alfe-dl-meta">Version {downloads.version} · {formatDate(pkg.date)} · Free</p>
          <p className="alfe-dl-lead">Everything in one download. Each lesson has short videos and activities for your class, and the teacher guide, slides and worksheet are in the kit’s <strong>Resources</strong> section.</p>

          <div className="alfe-card">
            <StepHead n={1}>Where will you use it?</StepHead>
            <div className="alfe-devices">
              {devices.map((d) => (
                <button type="button" key={d.id} className={device === d.id ? 'alfe-device is-on' : 'alfe-device'} aria-pressed={device === d.id} onClick={() => setDevice(d.id)}>
                  <span className="alfe-device-icon"><Icon name={d.icon} size={24} /></span>
                  <span className="alfe-device-text"><strong>{d.title}</strong><span>{d.sub}</span></span>
                </button>
              ))}
            </div>
            <button type="button" className={device === 'platform' ? 'alfe-platform-link is-on' : 'alfe-platform-link'} aria-pressed={device === 'platform'} onClick={() => setDevice('platform')}>
              <Icon name="school" size={18} />Using Moodle or another learning platform?
            </button>
          </div>

          {device === 'computer' && (
            <div className="alfe-card">
              <StepHead n={2}>Download the kit to your computer</StepHead>
              <a href={pkg.url} className="alfe-btn alfe-btn-primary alfe-btn-big alfe-start"><Icon name="download" />Download the kit · {megabytes(pkg.bytes)}</a>
              <p><strong>Then:</strong> right-click the ZIP file, choose <strong>Extract All</strong>, and double-click <strong>START HERE</strong> in the new folder. The teacher guide and slides are under <strong>Resources</strong>.</p>
            </div>
          )}

          {device === 'android' && (
            <div className="alfe-card">
              <StepHead n={2}>Get the app on your phone or tablet</StepHead>
              <p>A small app that downloads the kit in your language the first time you open it.</p>
              <a href={APP_URL} className="alfe-btn alfe-btn-primary alfe-btn-big alfe-start"><Icon name="download" />Download the app · {APP_MB} MB</a>
              <div className="alfe-steps-box">
                <h4>Then install it</h4>
                <ol>
                  <li>Open the downloaded file. If the phone asks, allow installing apps from this source.</li>
                  <li>Tap <strong>Install</strong>. If Play Protect warns you, tap <strong>Install anyway</strong>: the app is safe, it just isn’t from the Play Store.</li>
                  <li>Open the app and choose <strong>{pkg.name}</strong>. It downloads the kit once, so do this while you still have internet. After that, it works without internet.</li>
                </ol>
                {INSTALL_STEPS_URL && <a href={INSTALL_STEPS_URL}>See the steps with pictures</a>}
              </div>
              {onlineUrl && (
                <p className="alfe-muted">iPhone or iPad? <button type="button" className="alfe-inline-btn" onClick={() => setDevice('online')}>Use the kit online</button></p>
              )}
            </div>
          )}

          {device === 'online' && onlineUrl && (
            <div className="alfe-card">
              <StepHead n={2}>Use the kit online, with no download</StepHead>
              <p>The same kit in your browser, with nothing to install. It needs internet the whole time.</p>
              <a href={onlineUrl} className="alfe-btn alfe-btn-primary alfe-btn-big alfe-start"><Icon name="arrow" />Open the kit in {pkg.name}</a>
            </div>
          )}

          {device === 'platform' && (
            <div className="alfe-card">
              <StepHead n={2}>Add the kit to your learning platform</StepHead>
              <p>The kit is a small website made of ordinary files. START HERE opens everything else, so you can use it in two ways:</p>
              <div className="alfe-two">
                <div className="alfe-option">
                  <h4>Upload the whole kit</h4>
                  <p>If your platform can show a web page from a zip file, upload the kit and set <strong>START HERE</strong> as the page to open. Check your platform’s upload limit first.</p>
                  <a href={pkg.url} className="alfe-btn alfe-btn-primary alfe-start"><Icon name="download" size={18} />Download the kit · {megabytes(pkg.bytes)}</a>
                </div>
                <div className="alfe-option">
                  <h4>Or add the resources one by one</h4>
                  <p>Upload only the slides, worksheet, teacher guide or videos you need, like any other files.</p>
                  <a href="#one-by-one" className="alfe-link-strong">See the resources in {pkg.name} below</a>
                </div>
              </div>
            </div>
          )}

          {/* Single files: an alternative, so no step number */}
          <div id="one-by-one" className="alfe-files">
            <h3>Or download the resources one by one, in {pkg.name}</h3>
            <p className="alfe-muted">PDF to print, Word and PowerPoint to edit. They’re all inside the kit too.</p>
            <div className="alfe-files-list">
              {resourceRows(pkg).map((row) => (
                <div className="alfe-file-row" key={row.name}>
                  <div className="alfe-file-name">
                    <strong>{row.name}</strong>
                    {row.what && <span>{row.what}</span>}
                  </div>
                  <div className="alfe-file-btns">
                    {row.buttons.map(([label, url]) => <ResourceButton key={label} label={label} url={url} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="alfe-kolibri">Also available on <a href={KOLIBRI_URL} target="_blank" rel="noopener noreferrer">Kolibri</a>.</p>
        </div>
      </section>

      {/* Common questions */}
      <section className="alfe-section" aria-labelledby="faq-h">
        <div className="alfe-wrap alfe-narrow">
          <h2 id="faq-h">Common questions</h2>
          <div className="alfe-faq">
            <div className="alfe-faq-item">
              <h3>Do I need internet to teach it?</h3>
              <p>Only once. On a computer, to download the zip. On a phone, the first time you open the app. After that, everything works offline. You can copy the zip to other computers with a USB stick, so one download can serve a whole school.</p>
            </div>
            <div className="alfe-faq-item">
              <h3>Do I need to know about AI already?</h3>
              <p>No. The teacher guide and the videos show you how to teach each lesson.</p>
            </div>
            <div className="alfe-faq-item">
              <h3>Does every student need a device?</h3>
              <p>No. Students can use the kit on their own or in groups. The activities are made to be done together, so a group can share one device. The slides and worksheet can also be printed.</p>
            </div>
            <div className="alfe-faq-item">
              <h3>Can I share or change it?</h3>
              <p>Yes. The kit is under a <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer">CC BY-NC-SA</a> licence: share it and adapt it for your class, credit Learn AI Anywhere, don’t sell it, and share your changes the same way.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AILiteracyForEveryone;

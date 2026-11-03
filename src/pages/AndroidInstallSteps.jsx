import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import downloads from '../../course/downloads.json';
import { SMALL_APP_URL, hasLanguageApps, languageApp, appLabel } from './courseApps';
import './AILiteracyForEveryone.css';
import step1 from '../assets/images/ai-literacy/install/1-download-anyway.jpg';
import step2 from '../assets/images/ai-literacy/install/2-open.jpg';
import step3 from '../assets/images/ai-literacy/install/3-settings.jpg';
import step4 from '../assets/images/ai-literacy/install/4-allow.jpg';
import step5 from '../assets/images/ai-literacy/install/5-install.jpg';
import step6 from '../assets/images/ai-literacy/install/6-open-app.jpg';
import step7 from '../assets/images/ai-literacy/install/7-language.jpg';
import step8 from '../assets/images/ai-literacy/install/8-downloading.jpg';

// How to install the AI Literacy app from the APK, one screenshot per step. The
// screenshots are from Chrome on Android 14; other phones word things a little
// differently. Linked from the Android step of the course page.
//
// Once course/apps.json exists (see courseApps.js) it shows the app for one language,
// with the course inside (?lang=<package id>, also chosen on the page), and how to share
// it with another phone. Until then, the small app that downloads the course.

const APP_URL = SMALL_APP_URL;

const STEPS = [
  { img: step1, alt: 'Chrome asks: File might be harmful. Do you want to download ai-literacy.apk anyway?',
    title: 'Download the app', text: <>Open this page on your phone and tap <a href={APP_URL}>Download the app</a>. Chrome warns about every app that isn’t from the Play Store: tap <strong>Download anyway</strong>.</> },
  { img: step2, alt: 'Chrome shows: File downloaded, with an Open button',
    title: 'Open the file', text: <>When it says <strong>File downloaded</strong>, tap <strong>Open</strong>. Missed it? In Chrome, open the menu (⋮), then <strong>Downloads</strong>, and tap <strong>ai-literacy.apk</strong>.</> },
  { img: step3, alt: 'For your security, your phone currently isn’t allowed to install unknown apps from this source',
    title: 'Go to Settings', text: <>The first time, your phone says it isn’t allowed to install apps from Chrome. Tap <strong>Settings</strong>.</> },
  { img: step4, alt: 'Install unknown apps: Allow from this source, switched on',
    title: 'Allow it once', text: <>Turn on <strong>Allow from this source</strong>, then go back. You only do this once.</> },
  { img: step5, alt: 'AI Literacy: Do you want to install this app?',
    title: 'Install', text: <>Tap <strong>Install</strong>. If <strong>Play Protect</strong> warns you, tap <strong>More details</strong>, then <strong>Install anyway</strong>: the app is safe, it just isn’t from the Play Store.</> },
  { img: step6, alt: 'App installed, with Done and Open buttons',
    title: 'Open the app', text: <>When it says <strong>App installed</strong>, tap <strong>Open</strong>. The app is also on your home screen as <strong>AI Literacy</strong>.</> },
  { img: step7, alt: 'The app’s first screen: choose your language, with the size of each',
    title: 'Choose your language', text: <>Do this while you still have internet, ideally on Wi-Fi: the app now downloads the course in that language, under 200 MB.</> },
  { img: step8, alt: 'Getting your course ready: a progress bar',
    title: 'Wait for the download', text: <>If the connection drops, it carries on where it stopped. When it’s done, the course opens, and from then on it works without internet.</> },
];

// The app for one language, with the course inside. Pictures 1, 2, 5 and 6 show the small
// app (ai-literacy.apk, "AI Literacy") until they are taken again with a language app;
// step 7 has no picture yet.
const languageSteps = (app, name) => {
  const file = `ai-literacy-${app.id}.apk`;
  const label = appLabel(app.id);
  return [
    { img: step1, alt: `Chrome asks: File might be harmful. Do you want to download ${file} anyway?`,
      title: 'Download the app', text: <>Open this page on your phone, ideally on Wi-Fi, and tap <a href={app.latestUrl}>Download the {name} app</a> ({Math.round(app.bytes / 1e6)} MB): the whole course is inside. Chrome warns about every app that isn’t from the Play Store: tap <strong>Download anyway</strong>.</> },
    { img: step2, alt: 'Chrome shows: File downloaded, with an Open button',
      title: 'Open the file', text: <>When it says <strong>File downloaded</strong>, tap <strong>Open</strong>. Missed it? In Chrome, open the menu (⋮), then <strong>Downloads</strong>, and tap <strong>{file}</strong>.</> },
    STEPS[2],
    STEPS[3],
    { img: step5, alt: `${label}: Do you want to install this app?`,
      title: 'Install', text: <>Tap <strong>Install</strong>. It takes a little longer than most apps, because the course is inside. If <strong>Play Protect</strong> warns you, tap <strong>More details</strong>, then <strong>Install anyway</strong>: the app is safe, it just isn’t from the Play Store.</> },
    { img: step6, alt: 'App installed, with Done and Open buttons',
      title: 'Open the app', text: <>When it says <strong>App installed</strong>, tap <strong>Open</strong>. The app is also on your home screen as <strong>{label}</strong>.</> },
    { img: null, alt: '',
      title: 'The course opens', text: <>That’s it: from now on the course works without internet. You can delete {file} from your downloads to free up space, unless you want to share it.</> },
  ];
};

const StepList = ({ steps }) => (
  <ol className="alfe-install-steps">
    {steps.map((s, i) => (
      <li key={s.title}>
        {s.img && <img src={s.img} alt={s.alt} loading={i < 2 ? 'eager' : 'lazy'} width="432" height="936" />}
        <div>
          <h2><span className="alfe-step-num" aria-hidden="true">{i + 1}</span>{s.title}</h2>
          <p>{s.text}</p>
        </div>
      </li>
    ))}
  </ol>
);

const ShareSteps = ({ app }) => (
  <>
    <h2 className="alfe-install-share">Share it with another phone</h2>
    <p>The other phone needs no internet, and it can pass the app on to the next one.</p>
    <ul>
      <li><strong>ShareIt or Xender:</strong> open the <strong>Apps</strong> tab, pick <strong>{appLabel(app.id)}</strong> and send it. Both phones need the same sharing app.</li>
      <li><strong>Files by Google:</strong> tap <strong>Share</strong> and send <strong>ai-literacy-{app.id}.apk</strong> from your downloads. Keep the file if you want to share it again.</li>
    </ul>
    <p>On the other phone, open what it received. The first time, Android asks to allow installs from that app (ShareIt, Xender or Files): the same screens as steps 3 and 4. Then install and open it as in steps 5 and 6. It needs about {Math.round((app.bytes * 2) / 1e6)} MB free while it installs.</p>
  </>
);

const AndroidInstallSteps = () => {
  const [params, setParams] = useSearchParams();
  const packages = downloads.packages;
  const pkg = packages.find((p) => p.id === params.get('lang')) || packages[0];
  const app = languageApp(pkg.id);
  return (
    <div className="alfe">
      <section className="alfe-section alfe-install">
        <div className="alfe-wrap alfe-narrow">
          <p className="alfe-back"><Link to="/courses/ai-literacy-for-everyone#get">← AI Literacy for Everyone</Link></p>
          <h1>Install the AI Literacy app on Android</h1>
          <p className="alfe-section-lead">The app isn’t on the Play Store, so Android asks a few extra questions the first time. It takes about 2 minutes. Your phone may look a little different from these pictures.</p>
          {hasLanguageApps && (
            <div className="alfe-lang alfe-install-lang">
              <label htmlFor="alfe-install-lang">Language</label>
              <select id="alfe-install-lang" value={pkg.id} onChange={(e) => setParams({ lang: e.target.value }, { replace: true })}>
                {packages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
          {app ? (
            <>
              <StepList steps={languageSteps(app, pkg.name)} />
              <ShareSteps app={app} />
            </>
          ) : (
            <StepList steps={STEPS} />
          )}
          <p className="alfe-muted">NeuroPocket, the part of the course where learners train their own AI, needs a phone with at least 1 GB of memory (RAM). Using an iPhone or iPad? The app is for Android only.</p>
        </div>
      </section>
    </div>
  );
};

export default AndroidInstallSteps;

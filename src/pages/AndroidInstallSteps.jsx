import React from 'react';
import { Link } from 'react-router-dom';
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

const APP_URL = 'https://github.com/ousecTic/learnaianywhere/releases/download/app-latest/ai-literacy.apk';

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
    title: 'Choose your language', text: <>Do this while you still have internet, ideally on Wi-Fi: the app now downloads the kit in that language, 120 to 200 MB.</> },
  { img: step8, alt: 'Getting your course ready: a progress bar',
    title: 'Wait for the download', text: <>If the connection drops, it carries on where it stopped. When it’s done, the kit opens, and from then on it works without internet.</> },
];

const AndroidInstallSteps = () => (
  <div className="alfe">
    <section className="alfe-section alfe-install">
      <div className="alfe-wrap alfe-narrow">
        <p className="alfe-back"><Link to="/courses/ai-literacy-for-everyone#download">← AI Literacy for Everyone</Link></p>
        <h1>Install the AI Literacy app on Android</h1>
        <p className="alfe-section-lead">The app isn’t on the Play Store, so Android asks a few extra questions the first time. It takes about 2 minutes. Your phone may look a little different from these pictures.</p>
        <ol className="alfe-install-steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <img src={s.img} alt={s.alt} loading={i < 2 ? 'eager' : 'lazy'} width="432" height="936" />
              <div>
                <h2><span className="alfe-step-num" aria-hidden="true">{i + 1}</span>{s.title}</h2>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="alfe-muted">Using an iPhone or iPad? The app is for Android only.</p>
      </div>
    </section>
  </div>
);

export default AndroidInstallSteps;

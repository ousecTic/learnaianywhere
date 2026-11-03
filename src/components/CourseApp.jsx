import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Shows one of the course mini-apps inside the site layout. The apps live in
// course/apps/ and are built into public/course/apps/ by scripts/build-apps.mjs
// (npm run build:apps, which dev and build run first). The frame grows and shrinks
// with the app's content. Any ?lang= on the page address is passed on to the app.
const CourseApp = ({ app, title, params = {} }) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  Object.entries(params).forEach(([key, value]) => query.set(key, value));
  const queryString = query.toString();
  const src = `/course/apps/${app}/index.html${queryString ? `?${queryString}` : ''}`;

  const frameRef = useRef(null);
  const [height, setHeight] = useState(720);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    let stopWatching = () => {};

    const fitToContent = () => {
      const doc = frame.contentDocument;
      const win = frame.contentWindow;
      if (!doc || !doc.body || !win) return;
      stopWatching();
      // The body's own height: the document's scroll height never drops below the frame.
      const update = () => setHeight(Math.ceil(doc.body.getBoundingClientRect().height));
      update();
      // Content changes on clicks and typing; measure again once the app has redrawn,
      // and once more after the new frame height has let the text rewrap. A
      // ResizeObserver also catches anything else (it doesn't fire in hidden windows,
      // hence the event listeners too). It has to be the frame's own ResizeObserver.
      const afterChange = () => {
        win.setTimeout(update, 0);
        win.setTimeout(update, 200);
      };
      const events = ['click', 'input', 'change', 'keyup'];
      events.forEach((type) => doc.addEventListener(type, afterChange));
      doc.addEventListener('load', update, true); // pictures finishing loading
      window.addEventListener('resize', update);
      const observer = win.ResizeObserver ? new win.ResizeObserver(update) : null;
      if (observer) observer.observe(doc.body);
      stopWatching = () => {
        events.forEach((type) => doc.removeEventListener(type, afterChange));
        doc.removeEventListener('load', update, true);
        window.removeEventListener('resize', update);
        if (observer) observer.disconnect();
      };
    };

    frame.addEventListener('load', fitToContent);
    // The app may have finished loading before this effect ran.
    const loaded = frame.contentDocument;
    if (loaded && loaded.readyState === 'complete' && loaded.URL !== 'about:blank') fitToContent();
    return () => {
      frame.removeEventListener('load', fitToContent);
      stopWatching();
    };
  }, [src]);

  return (
    <iframe
      ref={frameRef}
      src={src}
      title={title}
      style={{ display: 'block', width: '100%', height: `${height}px`, border: 0 }}
    />
  );
};

export default CourseApp;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// On a new page, start at the top, or at the section named after # in the address
// (for links like /courses/ai-literacy-for-everyone#download).
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;

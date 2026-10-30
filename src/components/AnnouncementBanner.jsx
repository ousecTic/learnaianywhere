import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AnnouncementBanner.css';

// A new key each time the announcement changes, so people who closed the last one see it.
const DISMISSED_KEY = 'aiLiteracyKitAnnouncementDismissed';

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const isDismissed = localStorage.getItem(DISMISSED_KEY);
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="announcement-banner">
      <Link to="/courses/ai-literacy-for-everyone#download" className="announcement-content">
        <span className="announcement-text">
          New: AI Literacy for Everyone, a free teaching kit in 8 languages. Download it once and teach without internet.
        </span>
      </Link>
      <button 
        className="announcement-close" 
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
      >
        ×
      </button>
    </div>
  );
};

export default AnnouncementBanner;

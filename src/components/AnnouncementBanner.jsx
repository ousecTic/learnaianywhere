import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AnnouncementBanner.css';

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if banner was previously dismissed
    const isDismissed = localStorage.getItem('videoCourseAnnouncementDismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('videoCourseAnnouncementDismissed', 'true');
  };

  const handleClick = () => {
    navigate('/courses/ai-literacy-for-everyone');
  };

  if (!isVisible) return null;

  return (
    <div className="announcement-banner">
      <div className="announcement-content" onClick={handleClick}>
        <span className="announcement-text">
          AI Literacy for Everyone - Now available online, offline, and as a download
        </span>
      </div>
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

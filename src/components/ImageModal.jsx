import React, { useEffect, useRef } from 'react';

// A large view of one picture. Closes with the ×, a click outside it, or Esc,
// and gives focus back to whatever opened it.
const ImageModal = ({ image, caption, onClose }) => {
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      if (opener && opener.focus) opener.focus();
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-label={caption} onClick={e => e.stopPropagation()}>
        <button ref={closeRef} type="button" className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        <img src={image} alt={caption} />
        <div className="modal-caption">{caption}</div>
      </div>
    </div>
  );
};

export default ImageModal;

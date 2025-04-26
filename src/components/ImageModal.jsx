import React from 'react';
import Button from './shared/Button';

const ImageModal = ({ image, caption, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <img src={image} alt={caption} />
        <div className="modal-caption">{caption}</div>
      </div>
    </div>
  );
};

export default ImageModal;

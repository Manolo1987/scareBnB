import React from 'react';
import ReactDOM from 'react-dom';
import './Overlay.css';

const Overlay = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className='overlay' onClick={onClose}>
      <div className='overlay-content' onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Overlay;

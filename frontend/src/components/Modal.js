import React from 'react';

function Modal({ isActive, onClose, children }) {
  return (
    <>
      <div className={`modal-overlay ${isActive ? 'active' : ''}`} onClick={onClose}>
        <div className={`modal ${isActive ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </>
  );
}

export default Modal;

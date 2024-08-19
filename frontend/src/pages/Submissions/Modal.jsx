// Modal.jsx
import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, code }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Code</h2>
        <pre className="modal-code">{code}</pre>
      </div>
    </div>
  );
};

export default Modal;

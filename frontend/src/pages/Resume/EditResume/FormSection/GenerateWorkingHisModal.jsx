import React, { useEffect } from 'react';
import "./GenerateWorkingHisModal.scss";

const GenerateWorkingHisModal = ({ isOpen, onClose, data, onSelect, position, index }) => {
    if (!isOpen) return null;
    console.log("isOpen:", isOpen)

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="des-modal-overlay" style={{ top: position.top, left: position.left }} onClick={handleOverlayClick}>
            <div className="des-modal-content">
                <div className="des-modal-header">
                    <h2>Select Description</h2>

                    <button onClick={onClose} className="btn-danger">X</button>

                </div>
                <ul className="summary-list">
                    {Object.entries(data).map(([title, text]) => (
                        <li key={title} onClick={() => onSelect(text, index)} className="summary-item">
                            <strong> {title}</strong>
                            <p>{text}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GenerateWorkingHisModal;

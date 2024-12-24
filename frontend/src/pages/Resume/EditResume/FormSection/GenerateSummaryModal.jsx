// import React, { useEffect } from 'react';
// import "./GenerateSummaryModal.scss";

// const GenerateSummaryModal = ({ isOpen, onClose, data, onSelect, position }) => {
//     if (!isOpen) return null;
//     console.log("isOpen:", isOpen)

//     const handleOverlayClick = (e) => {
//         if (e.target === e.currentTarget) {
//             onClose();
//         }
//     };

//     return (
//         <div className="sum-modal-overlay" style={{ top: position.top, left: position.left }} onClick={handleOverlayClick}>
//             <div className="sum-modal-content">
//                 <div className="sum-modal-header">
//                     <h2>Select Summary</h2>

//                     <button onClick={onClose} className="btn-danger">X</button>

//                 </div>
//                 <ul className="summary-list">
//                     {Object.entries(data).map(([title, text]) => (
//                         <li key={title} onClick={() => onSelect(text)} className="summary-item">
//                             <strong>Level: {title}</strong>
//                             <p>{text}</p>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default GenerateSummaryModal;
import React from 'react';
import "./GenerateSummaryModal.scss";

const GenerateSummaryModal = ({ isOpen, onClose, data, onSelect, position }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="sum-modal-overlay"
            style={{ top: position.top, left: position.left }}
            onClick={handleOverlayClick}
        >
            <div className="sum-modal-content">
                <div className="sum-modal-header">
                    <h2>Select Summary</h2>
                    <button onClick={onClose} className="btn-danger">X</button>
                </div>
                <ul className="summary-list">
                    {Object.entries(data).map(([title, text]) => (
                        <li
                            key={title}
                            onClick={() => onSelect(text.summary || '')}
                            className="summary-item"
                        >
                            <strong>Level: {title}</strong>
                            <p><strong>Name:</strong> {text.name || 'N/A'}</p>
                            <p><strong>Summary:</strong> {text.summary || 'No summary available'}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GenerateSummaryModal;

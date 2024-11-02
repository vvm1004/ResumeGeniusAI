// // Modal.js
// import React from 'react';
// import './Modal.css';

// const Modal = ({ isOpen, onClose, handleButtonClick, handleFileChange, fileInputRef }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="modal-overlay" onClick={onClose}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                 <button className="close-button" onClick={onClose}>
//                     &times; {/* Dấu X */}
//                 </button>
//                 <h2 className="modal-title">File Upload</h2>
//                 <p className="modal-description">Please select a file to upload.</p>
//                 <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileChange}
//                     style={{ display: 'none' }} // Hide file input
//                 />
//                 <button
//                     className="custom-button"
//                     onClick={handleButtonClick}
//                 >
//                     Select File
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Modal;

// Modal.js
// Modal.js
import React, { useCallback, useEffect, useState } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, handleButtonClick, handleFileChange, fileInputRef, isLoading = false, openLoading }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            console.log("file:", files)
            handleFileChange({ target: { files } });
        }
        setIsDragging(false);

    }, [handleFileChange]);

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
        openLoading();

    };
    useEffect(() => {
        console.log("overlay")
    }, fileInputRef)
    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="loader"></div>
                    </div>
                )}
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={onClose}>
                        &times; {/* Dấu X */}
                    </button>
                    <h2 className="modal-title">File Upload</h2>
                    <p className="modal-description">Please select a file to upload or drag it here.</p>

                    <div
                        className={`drop-area ${isDragging ? 'dragging' : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <p>Drag and drop your file here</p>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }} // Ẩn input file
                    />
                    <button
                        className="custom-button"
                        onClick={handleButtonClick}
                    >
                        Select File
                    </button>
                </div>
            </div>

        </>
    );
};

export default Modal;

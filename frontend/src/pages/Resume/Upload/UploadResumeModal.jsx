
// import React, { useCallback, useEffect, useState } from 'react';
// import './Modal.css';

// const UploadResumeModal = ({ isOpen, onClose, handleButtonClick, handleFileChange, fileInputRef, isLoading = false, openLoading }) => {
//     const [isDragging, setIsDragging] = useState(false);

//     const handleDrop = useCallback((event) => {
//         event.preventDefault();
//         event.stopPropagation();
//         const files = event.dataTransfer.files;
//         if (files.length > 0) {
//             console.log("file:", files)
//             handleFileChange({ target: { files } });
//         }
//         setIsDragging(false);

//     }, [handleFileChange]);

//     const handleDragOver = (event) => {
//         event.preventDefault();
//         event.stopPropagation();
//         setIsDragging(true);
//     };

//     const handleDragLeave = () => {
//         setIsDragging(false);
//         openLoading();

//     };
//     useEffect(() => {
//         console.log("overlay")
//     }, fileInputRef)
//     if (!isOpen) return null;

//     return (
//         <>
//             <div className="modal-overlay" onClick={onClose}>
//                 {isLoading && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                         <div className="loader"></div>
//                     </div>
//                 )}
//                 <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                     <button className="close-button" onClick={onClose}>
//                         &times; {/* Dấu X */}
//                     </button>
//                     <h2 className="modal-title">File Upload</h2>
//                     <p className="modal-description">Please select a file to upload or drag it here.</p>

//                     <div
//                         className={`drop-area ${isDragging ? 'dragging' : ''}`}
//                         onDrop={handleDrop}
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                     >
//                         <p>Drag and drop your file here</p>
//                     </div>

//                     <input
//                         type="file"
//                         ref={fileInputRef}
//                         onChange={handleFileChange}
//                         style={{ display: 'none' }} // Ẩn input file
//                     />
//                     <button
//                         className="custom-button"
//                         onClick={handleButtonClick}
//                     >
//                         Select File
//                     </button>
//                 </div>
//             </div>

//         </>
//     );
// };

// export default UploadResumeModal;


import React, { useCallback, useState, useEffect } from 'react';
import './Modal.css';
import { PDFDocument } from 'pdf-lib';
import { compressPdf } from './utils.js'; // This would be incorrect if your file is lowercase

const UploadResumeModal = ({ isOpen, onClose, handleFileChange, fileInputRef, isLoading = false, openLoading, closeLoading }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null); // Lưu thông tin tệp
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState(0);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const selectedFile = files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setFileSize(selectedFile.size);
            //  handleFileChange({ target: { files } }); // Gọi handleFileChange nếu cần
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
        openLoading(); // Nếu cần thì có thể xử lý loading ở đây
    };

    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setFileSize(selectedFile.size);
        }
    };

    const handleSubmit = async () => {

        if (file) {
            const fileSizeInMB = file.size / (1024 * 1024); // chuyển từ bytes sang MB
            if (fileSizeInMB > 100) {
                console.log("fileSizeInMB:", fileSizeInMB)
                try {
                    const compressedFile = await compressPdf(file);
                    if (compressedFile) {
                        const compressedFileName = `compressed-${file.name}`;
                        const compressedFileSize = compressedFile.size;
                        setFile(compressedFile);
                        setFileName(compressedFileName);
                        setFileSize(compressedFileSize);
                        console.log("compressedFile:", compressedFile, "compressedFileSize", compressedFileSize)


                        const event = { target: { files: [compressedFile] } };
                        handleFileChange(event);
                    } else {
                        alert('File compression failed');
                    }
                } catch (error) {
                    console.error('Error during compression:', error);
                    alert('Error while compressing the file');
                } finally {
                    closeLoading();
                }
            } else {
                const event = { target: { files: [file] } };
                handleFileChange(event);
            }
        }

    };
    useEffect(() => {
        if (!isOpen) {
            setFile(null);
            setFileName('');
            setFileSize(0);
        }
    }, [isOpen]);

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
                        &times;
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
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }} // Ẩn input file
                    />
                    {file && (
                        <div className="file-info">
                            <p><strong>File Name:</strong> {fileName}</p>
                            <p><strong>File Size:</strong> {fileSize > 1024 ? `${(fileSize / 1024).toFixed(2)} KB` : `${fileSize} bytes`}</p>
                        </div>
                    )}
                    {!file && (
                        <div className="file-info">Attached files should be less than 100 MB in size</div>
                    )}
                    <button
                        className="upload-custom-button"
                        onClick={() => fileInputRef.current.click()} // Mở input file khi nhấn nút "Select File"
                    >
                        Select File
                    </button>



                    <button
                        className="upload-custom-button"
                        onClick={handleSubmit}
                        disabled={!file || isLoading} // Disable button khi chưa có tệp hoặc đang loading
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
};

export default UploadResumeModal;

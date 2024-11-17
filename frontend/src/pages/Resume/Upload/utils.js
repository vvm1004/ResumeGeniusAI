// utils.js

import { PDFDocument } from 'pdf-lib';

export async function compressPdf(file) {
    const existingPdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
        const images = page.getImages();
        images.forEach((image) => {
            image.scale(0.5);  
        });
    });

    const compressedPdfBytes = await pdfDoc.save();
    return new Blob([compressedPdfBytes], { type: 'application/pdf' });
}

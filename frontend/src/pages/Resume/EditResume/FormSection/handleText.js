
export function cleanContent(text) {
    let cleanText = text.replace(/&lt;p&gt;/g, '').replace(/&lt;\/p&gt;/g, '');
    //  console.log("cleanText: ", cleanText)
    cleanText = text.replace(/<\/?p>|/gi, "");
    // console.log("cleanText1: ", cleanText)

    const textEntities = {
        '&bull;': '•',
    };

    for (const [key, value] of Object.entries(textEntities)) {
        cleanText = cleanText.replace(new RegExp(key, 'g'), value);
    }
    cleanText.replace(/&middot;/g, '·')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    //console.log("cleanText2: ", cleanText)

    return cleanText.trim();
}

export function applyImproveSentence(originalSentence, improveSentence) {

    originalSentence = `<span style="background-color: rgb(224, 62, 45);" >${escapeHtml(originalSentence)}</span> </br></br>`;
    improveSentence = `<span style="background-color: rgb(45, 194, 107);" >${escapeHtml(improveSentence)}</span>`;

    let highlightedSentence = originalSentence + "\n\n" + improveSentence; // Bắt đầu với câu gốc

    return highlightedSentence;
};
export function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};
export function applyCorrections(sentence, corrections) {
    let highlightedSentence = sentence;
    console.log("corrections:\n", corrections)

    corrections.forEach(([wrongWord, correctWord]) => {
        const wrongSpan = `<span style="background-color: rgb(224, 62, 45);" >${escapeHtml(wrongWord)}</span>`;
        const correctSpan = `<span style="background-color: rgb(45, 194, 107);" >${escapeHtml(correctWord)}</span>`;
        highlightedSentence = highlightedSentence.replace(
            new RegExp(`\\b${escapeRegExp(wrongWord)}\\b`, 'g'),
            `${wrongSpan} ${correctSpan}`
        );
        console.log("highlightedSentence:\n", wrongWord, "\t\t", correctWord)

    });

    return highlightedSentence;
};
// export function applyCorrections(sentence, corrections) {
//     let highlightedSentence = sentence;

//     corrections.forEach(([wrongWord, correctWord]) => {
//         // Regex khớp từ và dấu câu (.,!?; hoặc xuống dòng)
//         const wrongWordRegex = new RegExp(
//             `\\b${escapeRegExp(wrongWord)}([.,;!?\\s]*)\\b`,
//             'gi' // 'g' để thay thế tất cả, 'i' không phân biệt hoa thường
//         );
//         const wrongSpan = `<span style="background-color: rgb(224, 62, 45);" >${escapeHtml(wrongWord)}</span>`;
//         const correctSpan = `<span style="background-color: rgb(45, 194, 107);" >${escapeHtml(correctWord)}</span>`;

//         // Thay thế từ sai, bảo toàn dấu câu hoặc xuống dòng
//         highlightedSentence = highlightedSentence.replace(
//             wrongWordRegex,
//             (match, punctuation) => `${wrongSpan} ${correctSpan}${punctuation}`
//         );
//     });

//     return highlightedSentence;
// }
// export function highlightCorrectionsWithFormatting(text, corrections) {
//     // Chia từng dòng nếu có xuống dòng
//     const lines = text.split('\n');
//     const highlightedLines = lines.map(line => applyCorrections(line, corrections));
//     return highlightedLines.join('\n'); // Ghép lại, giữ nguyên dấu xuống dòng
// }
export function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
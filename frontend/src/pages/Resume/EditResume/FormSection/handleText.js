
export function cleanContent(text) {
    let cleanText = text.replace(/&lt;p&gt;/g, '').replace(/&lt;\/p&gt;/g, '');
    console.log("cleanText: ", cleanText)
    cleanText = text.replace(/<\/?p>|/gi, "");
    console.log("cleanText1: ", cleanText)

    const textEntities = {
        '&bull;': '•',
    };

    for (const [key, value] of Object.entries(textEntities)) {
        cleanText = cleanText.replace(new RegExp(key, 'g'), value);
    }

    console.log("cleanText2: ", cleanText)

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
    let highlightedSentence = sentence; // Bắt đầu với câu gốc
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
export function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
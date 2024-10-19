
const API_URL = 'http://localhost:8000/api/v1/resume-upgrade/';

export const spellCheckText = async (text) => {
    try {
        const response = await fetch(API_URL + "check-spelling", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sentence: text }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error while checking spelling:', error);
        throw error;
    }
};
export const improveSentence = async (text) => {
    try {
        const response = await fetch(API_URL + "improve", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sentence: text }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error while improve sentence:', error);
        throw error;
    }
};



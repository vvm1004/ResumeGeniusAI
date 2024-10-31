
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

export const generateSummary = async (data) => {
    var newData = transformUserData(data)
    console.log("\n\ndataa: ", newData)
    try {
        const response = await fetch(API_URL + "generate-summary", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: newData }),
        });
        console.log("response:", response)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.data;

    } catch (error) {
        console.error('Error while improve sentence:', error);
        throw error;
    }
};
export const transformUserData = (userData) => {
    return {
        name: userData.personalInformation.name || '',
        job_title: userData.title || '',
        achievements: userData.awards.map(award => award.title) || [],
        skills: userData.skills.map(skill => skill.value) || [],
        activities: userData.activities || [],
        hobbies: userData.interests.map(interest => interest.title) || [],
        education: userData.education.map(edu => edu.degree || '') || [],
        languages: userData.languages || [],
        employment_history: userData.experience.map(exp => exp.jobTitle) || []
    };
};
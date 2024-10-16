import { ObjectId } from "mongoose";

interface PersonalInformation {
    name: string;
    email: string;
    address: string;
    phone: string;
    github?: string;
    linkedin?: string;
    socialLink?: string;
}

interface Experience {
    title: string;
    company: string;
    position: string;
    date: string;
    description: string;
    responsibilities: string[];
}

interface Education {
    degree: string;
    major: string;
    institution: string;
    gpa: string;
    date: string;
}

interface Project {
    title: string;
    description: string;
    features: string;
    technologies: string;
    githubLink: string;
    demo: string;
    date: string;
    tool: string;
}

interface Activity {
    title: string;
    organization: string;
    date: string;
    description: string;
    role: string;
    achievements: string[];
}

interface Award {
    title: string;
    issuer: string;
    date: string;
    description: string;
}

interface Skill {
    title: string;
    value: string;
}

interface Language {
    title: string;
    level: string;
}

interface Interest {
    title: string;
    description: string;
}

interface Reference {
    name: string;
    position: string;
    organization: string;
    contact: string;
}

interface Certification {
    name: string;
    details: string;
    year: string;
    link: string;
}

interface CustomField {
    title: string;
    value: string;
    date: string;
}

interface ResumeBuilderData {
    title: string;
    user: string;
    personalInformation: PersonalInformation;
    summary: string;
    experience: Experience[];
    education: Education[];
    projects: Project[];
    activities: Activity[];
    awards: Award[];
    skills: Skill[];
    languages: Language[];
    interests: Interest[];
    references: Reference[];
    certifications: Certification[];
    customFields: CustomField[];
}
function processResumeData(data: any, userId: string): ResumeBuilderData {
    console.log("\n\n\n\n\tUserId processResumeData: ", userId, "\n\n\n")
    return {
        title: data.title || "Untitled",
        user: userId,
        personalInformation: {
            name: data["Personal Information"]?.Name?.value || "",
            email: data["Personal Information"]?.Email?.value || "",
            address: data["Personal Information"]?.Address?.value || "",
            phone: data["Personal Information"]?.Phone?.value || "",
            github: data["Personal Information"]?.Github?.value || "",
            linkedin: data["Personal Information"]?.Linkedin?.value || "",
            socialLink: data["Personal Information"]?.["Social link"]?.value || "",
        },
        summary: data.Summary?.value || "",
        experience: data.Experience?.map((exp: any) => ({
            title: exp.Title?.value || "",
            company: exp.Company?.value || "",
            position: exp.Position?.value || "",
            date: exp.Date?.value || "",
            description: exp.Description?.value || "",
            responsibilities: exp.Responsibilities?.items.map((item: any) => item.value) || [], // Lấy giá trị string từ item
        })) || [],
        education: data.Education?.map((edu: any) => ({
            degree: edu.Degree?.value?.[0] || "",
            major: edu.Major?.value || "",
            institution: edu.Institution?.value || "",
            gpa: edu.GPA?.value || "",
            date: edu.Date?.value || "",
        })) || [],
        projects: data.Projects?.map((proj: any) => ({
            title: proj.Title?.value || "",
            description: proj.Description?.value || "",
            features: proj.Features?.value || "",
            technologies: Array.isArray(proj.Technologies?.value) ? proj.Technologies.value.join(", ") : "",
            githubLink: proj["Github link"]?.value || "",
            demo: Array.isArray(proj.Demo?.value) && proj.Demo.value.length > 0 ? proj.Demo.value[0] : "", // Lấy phần tử đầu tiên hoặc để trống
            date: proj.Date?.value || "",
            tool: proj.Tool?.value || "",
        })) || [],
        activities: data.Activities?.map((activity: any) => ({
            title: activity.Title?.value || "",
            organization: activity.Organization?.value || "",
            date: activity.Date?.value || "",
            description: activity.Description?.value || "",
            role: activity.Role?.value || "",
            achievements: activity.Achievements?.items || [],
        })) || [],
        awards: data.Accomplishments?.map((award: any) => ({
            title: award.Title?.value || "",
            issuer: award.Issuer?.value || "",
            date: award.Date?.value || "",
            description: award.Description?.value || "",
        })) || [],
        skills: data.Skills?.map((skill: any) => ({
            title: skill.Title?.value || "",
            value: skill.Value?.value || "",
        })) || [],
        languages: data.Languages?.map((lang: any) => ({
            title: lang.Title?.value || "",
            level: lang.Level?.value || "",
        })) || [],
        interests: data.Interests?.map((interest: any) => ({
            title: interest.Title?.value || "",
            description: interest.Description?.value || "",
        })) || [],
        references: data.References?.map((ref: any) => ({
            name: ref.Name?.value || "",
            position: ref.Position?.value || "",
            organization: ref.Organization?.value || "",
            contact: ref.Contact?.value || "",
        })) || [],
        certifications: data.Certifications?.map((cert: any) => ({
            name: cert.Name?.value || "",
            details: cert.Details?.value || "",
            year: cert.Year?.value || "",
            link: cert.Link?.value || "",
        })) || [],
        customFields: data.CustomFields?.map((field: any) => ({
            title: field.Title?.value || "",
            value: field.Value?.value || "",
            date: field.Date?.value || "",
        })) || [],
    };
}


export default processResumeData;

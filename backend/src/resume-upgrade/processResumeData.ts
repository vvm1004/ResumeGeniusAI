import { ObjectId } from "mongoose";

interface PersonalInformation {
    name: string;
    email: string;
    address: string;
    phone: string;
    github?: string;
    linkedin?: string;
    socialLink?: string;
    image?: string;
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
    template: string;
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


// function processResumeData(data: any, userId: string): ResumeBuilderData {
//     // console.log("\n\n\n\n\tUserId processResumeData: ", data, "\n\n\n")
//     return {
//         title: data.title || "Untitled",
//         user: userId,
//         template: "67125252513c2654c1ddd086",
//         personalInformation: {
//             name: data["Personal Information"]?.Name?.value || "",
//             email: data["Personal Information"]?.Email?.value || "",
//             address: data["Personal Information"]?.Address?.value || "",
//             phone: data["Personal Information"]?.Phone?.value || "",
//             github: data["Personal Information"]?.Github?.value || "",
//             linkedin: data["Personal Information"]?.Linkedin?.value || "",
//             socialLink: data["Personal Information"]?.["Social link"]?.value || "",
//             image: data["Personal Information"]?.["Image"] || "",
//         },
//         summary: data.Summary?.value || "",
//         experience: data.Experience?.map((exp: any) => ({
//             title: exp.Title?.value || "",
//             company: exp.Company?.value || "",
//             position: exp.Position?.value || "",
//             date: exp.Date?.value || "",
//             description: exp.Description?.value || "",
//             responsibilities: exp.Responsibilities?.items.map((item: any) => item.value) || [], // Lấy giá trị string từ item
//         })) || [],
//         education: data.Education?.map((edu: any) => ({
//             degree: edu.Degree?.value?.[0] || "",
//             major: edu.Major?.value || "",
//             institution: edu.Institution?.value || "",
//             gpa: edu.GPA?.value || "",
//             date: edu.Date?.value || "",
//         })) || [],
//         projects: data.Projects?.map((proj: any) => ({
//             title: proj.Title?.value || "",
//             description: proj.Description?.value || "",
//             features: proj.Features?.value || "",
//             technologies: Array.isArray(proj.Technologies?.value) ? proj.Technologies.value.join(", ") : "",
//             githubLink: proj["Github link"]?.value || "",
//             demo: Array.isArray(proj.Demo?.value) && proj.Demo.value.length > 0 ? proj.Demo.value[0] : "", // Lấy phần tử đầu tiên hoặc để trống
//             date: proj.Date?.value || "",
//             tool: (Array.isArray(proj.Tool.value) ? proj.Tool.value.join(', ') : proj.Tool?.value) || "",
//         })) || [],
//         activities: data.Activities?.map((activity: any) => ({
//             title: activity.Title?.value || "",
//             organization: activity.Organization?.value || "",
//             date: activity.Date?.value || "",
//             description: activity.Description?.value || "",
//             role: activity.Role?.value || "",
//             achievements: activity.Achievements?.items || [],
//         })) || [],
//         awards: data.Accomplishments?.map((award: any) => ({
//             title: award.Title?.value || "",
//             issuer: award.Issuer?.value || "",
//             date: award.Date?.value || "",
//             description: award.Description?.value || "",
//         })) || [],
//         skills: data.Skills?.map((skill: any) => ({
//             title: skill.Title?.value || "",
//             value: skill.Value?.value || "",
//         })) || [],
//         languages: data.Languages?.map((lang: any) => ({
//             title: lang.Title?.value || "",
//             level: lang.Level?.value || "",
//         })) || [],
//         interests: data.Interests?.map((interest: any) => ({
//             title: interest.Title?.value || "",
//             description: interest.Description?.value || "",
//         })) || [],
//         references: data.References?.map((ref: any) => ({
//             name: ref.Name?.value || "",
//             position: ref.Position?.value || "",
//             organization: ref.Organization?.value || "",
//             contact: ref.Contact?.value || "",
//         })) || [],
//         certifications: data.Certifications?.map((cert: any) => ({
//             name: cert.Name?.value || "",
//             details: cert.Details?.value || "",
//             year: cert.Year?.value || "",
//             link: cert.Link?.value || "",
//         })) || [],
//         customFields: data.CustomFields?.map((field: any) => ({
//             title: field.Title?.value || "",
//             value: field.Value?.value || "",
//             date: field.Date?.value || "",
//         })) || [],
//     };
// }





// function cleanField(field: any): string {
//     if (typeof field === 'object' && field?.value) {
//         return field.value; // Lấy giá trị từ object
//     }
//     return typeof field === 'string' ? field : ''; // Nếu là string, trả về chính nó, nếu không trả về chuỗi rỗng
// }
function cleanField(field: any): string {
    if (Array.isArray(field)) {
        // Nếu là mảng, lấy phần tử đầu tiên và xử lý đệ quy
        return field.length > 0 ? cleanField(field[0]) : "";
    }
    if (typeof field === "object") {
        // Nếu là object, kiểm tra trường hợp có `value` hoặc `Value`
        if (field?.value) {
            return cleanField(field.value);
        }
        if (field?.Value) {
            return cleanField(field.Value);
        }
    }
    // Trả về chính giá trị nếu là chuỗi, nếu không thì trả về chuỗi rỗng
    return typeof field === "string" ? field : "";
}


function processResumeData(data: any, userId: string): ResumeBuilderData {
    console.log(data)
    console.log("\n\n---------------------------------------\n\n")
    return {
        title: cleanField(data.title) || "Untitled",
        user: userId,
        template: "67125252513c2654c1ddd086",
        personalInformation: {
            name: cleanField(data["Personal Information"]?.Name),
            email: cleanField(data["Personal Information"]?.Email),
            address: cleanField(data["Personal Information"]?.Address),
            phone: cleanField(data["Personal Information"]?.Phone),
            github: cleanField(data["Personal Information"]?.Github),
            linkedin: cleanField(data["Personal Information"]?.Linkedin),
            socialLink: cleanField(data["Personal Information"]?.["Social link"]),
            image: cleanField(data["Personal Information"]?.Image),
        },
        summary: cleanField(data.Summary),
        experience: data.Experience?.map((exp: any) => ({
            title: cleanField(exp.Title),
            company: cleanField(exp.Company),
            position: cleanField(exp.Position),
            date: cleanField(exp.Date),
            description: cleanField(exp.Description),
            responsibilities: exp.Responsibilities?.items?.map((item: any) => cleanField(item)) || [],
        })) || [],
        education: data.Education?.map((edu: any) => ({
            degree: cleanField(edu.Degree),
            major: cleanField(edu.Major),
            institution: cleanField(edu.Institution),
            gpa: cleanField(edu.GPA),
            date: cleanField(edu.Date),
        })) || [],
        projects: data.Projects?.map((proj: any) => ({
            title: cleanField(proj.Title),
            description: cleanField(proj.Description),
            features: cleanField(proj.Features),
            technologies: Array.isArray(proj.Technologies?.value)
                ? proj.Technologies.value.join(", ")
                : cleanField(proj.Technologies),
            githubLink: cleanField(proj["Github link"]),
            demo: Array.isArray(proj.Demo?.value) && proj.Demo.value.length > 0 ? cleanField(proj.Demo.value[0]) : "",
            date: cleanField(proj.Date),
            tool: Array.isArray(proj.Tool?.value)
                ? proj.Tool.value.join(", ")
                : cleanField(proj.Tool),
        })) || [],
        activities: data.Activities?.map((activity: any) => ({
            title: cleanField(activity.Title),
            organization: cleanField(activity.Organization),
            date: cleanField(activity.Date),
            description: cleanField(activity.Description),
            role: cleanField(activity.Role),
            achievements: activity.Achievements?.items?.map((item: any) => cleanField(item)) || [],
        })) || [],
        awards: data.Accomplishments?.map((award: any) => ({
            title: cleanField(award.Title),
            issuer: cleanField(award.Issuer),
            date: cleanField(award.Date),
            description: cleanField(award.Description),
        })) || [],
        skills: data.Skills?.map((skill: any) => ({
            title: cleanField(skill.Title),
            value: cleanField(skill.Value),
        })) || [],
        languages: data.Languages?.map((lang: any) => ({
            title: cleanField(lang.Title),
            level: cleanField(lang.Level),
        })) || [],
        interests: data.Interests?.map((interest: any) => ({
            title: cleanField(interest.Title),
            description: cleanField(interest.Description),
        })) || [],
        references: data.References?.map((ref: any) => ({
            name: cleanField(ref.Name),
            position: cleanField(ref.Position),
            organization: cleanField(ref.Organization),
            contact: cleanField(ref.Contact),
        })) || [],
        certifications: data.Certifications?.map((cert: any) => ({
            name: cleanField(cert.Name),
            details: cleanField(cert.Details),
            year: cleanField(cert.Year),
            link: cleanField(cert.Link),
        })) || [],
        customFields: data.CustomFields?.map((field: any) => ({
            title: cleanField(field.Title),
            value: cleanField(field.Value),
            date: cleanField(field.Date),
        })) || [],
    };
}



export default processResumeData;
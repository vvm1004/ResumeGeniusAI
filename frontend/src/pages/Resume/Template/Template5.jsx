import React from 'react';
import defaultData from "./defaultData.json";
const Resume = ({data}) => {
  const skillsToDisplay = data?.skills?.length > 0 ? data.skills : defaultData.skills;
  const languagesToDisplay = data?.languages?.length > 0 ? data.languages : defaultData.languages;
  const educationToDisplay = data?.education?.length > 0 ? data.education : defaultData.education;
  const experienceToDisplay = data?.experience?.length > 0 ? data.experience : defaultData.experience;
  const title = data?.title || defaultData.title;
  const summary = data?.summary || defaultData.summary;
  // Defaulting personal information if missing
  const name = data?.personalInformation?.name || defaultData.personalInformation.name;
  const phone = data?.personalInformation?.phone || defaultData.personalInformation.phone;
  const email = data?.personalInformation?.email || defaultData.personalInformation.email;
  const address = data?.personalInformation?.address || defaultData.personalInformation.address;
  return (
    <div className="resume-cv w-[210mm] h-[297mm] bg-white p-8 rounded-lg shadow-lg flex">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wider">
            {name}
          </h1>
          <p className="text-lg font-semibold mt-2">{title}</p>
          <div className="mt-4 flex justify-center space-x-4 text-gray-600">
            <p><i className="fas fa-phone mr-2"></i>{phone}</p>
            <p><i className="fas fa-envelope mr-2"></i>{email}</p>
            <p><i className="fas fa-map-marker-alt mr-2"></i>{address}</p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold tracking-wide text-gray-800 border-b-2 border-gray-300 pb-2">
            Summary
          </h2>
          <p className="mt-4 text-gray-700 text-sm">
            {summary}
          </p>
        </div>

        {/* Main Section */}
        <div className="mt-8 flex">
          {/* Left Column */}
          <div className="w-1/2 pr-4">
            {/* Education */}
            <h2 className="text-xl font-bold tracking-wide text-gray-800 border-b-2 border-gray-300 pb-2">
              Education
            </h2>
            {educationToDisplay.map((education, index) => (
              <div className="mt-4" key={index}>
                <h3 className="font-semibold text-gray-800">{education.school}</h3>
                <p className="text-sm text-gray-600">{education.degree} | {education.date}</p>
                <p className="text-sm text-gray-700">{education.description}</p>
              </div>
            ))}

            {/* Skills */}
            <h2 className="text-xl font-bold tracking-wide text-gray-800 border-b-2 border-gray-300 pb-2 mt-8">
              Skills
            </h2>
            {skillsToDisplay.map((skill, index) => (
              <div className="mt-4" key={index}>
                <h3 className="font-semibold text-gray-800">{skill.title}</h3>
                <p className="mt-4 list-disc list-inside text-sm text-gray-700">{skill.value}</p>
              </div>
            ))}

            {/* Certifications */}
            <h2 className="text-xl font-bold tracking-wide text-gray-800 border-b-2 border-gray-300 pb-2 mt-8">
              Certifications
            </h2>
            <ul className="mt-4 list-disc list-inside text-sm text-gray-700">
              <li>Executive Secretary and Business Administration Certification</li>
              <li>Advanced Executive Assistant and Office Manager Diploma</li>
              <li>Executive Office Professional Certificate Program</li>
            </ul>
          </div>

          {/* Right Column */}
          <div className="w-1/2 pl-4">
            {/* Professional Experience */}
            <h2 className="text-xl font-bold tracking-wide text-gray-800 border-b-2 border-gray-300 pb-2">
              Professional Experience
            </h2>
            {experienceToDisplay.map((experience, index) => (
              <div className="mt-4" key={index}>
                <h3 className="font-semibold text-gray-800">{experience.title}</h3>
                <p className="text-sm text-gray-600">{experience.company} | {experience.date}</p>
                <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                  {experience.description.split('\n').map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;

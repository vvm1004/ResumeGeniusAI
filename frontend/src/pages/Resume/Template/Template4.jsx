import React from 'react';
import defaultData from "./defaultData.json";
const Resume = ({ data }) => {
  // Defaulting sections if data is missing
  const skillsToDisplay = data?.skills?.length > 0 ? data.skills : defaultData.skills;
  const languagesToDisplay = data?.languages?.length > 0 ? data.languages : defaultData.languages;
  const educationToDisplay = data?.education?.length > 0 ? data.education : defaultData.education;
  const experienceToDisplay = data?.experience?.length > 0 ? data.experience : defaultData.experience;
  const title = data?.title || defaultData.title;
  const summary = data?.summary || defaultData.summary;
  const image = data?.personalInformation?.image || defaultData.personalInformation.image;
  // Defaulting personal information if missing
  const name = data?.personalInformation?.name || defaultData.personalInformation.name;
  const phone = data?.personalInformation?.phone || defaultData.personalInformation.phone;
  const email = data?.personalInformation?.email || defaultData.personalInformation.email;
  const address = data?.personalInformation?.address || defaultData.personalInformation.address;

  return (
    <div className="w-[210mm] h-[297mm] bg-white p-8 rounded-lg shadow-lg flex">
      <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex h-full w-full">
          {/* Left section (Profile image and details) */}
          <div className="w-1/3 bg-indigo-900 text-white p-6">
            <div className="flex flex-col">
              <img
                src={image}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white mb-4"
              />
              <h2 className="text-3xl font-bold mb-2">{name}</h2>
              <p className="text-xl font-light">{title}</p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-1">About Me</h3>
                <p className="text-sm">
                  {summary}
                </p>
              </div>
              <div className="mt-4">
                <p className="flex items-center mt-2">
                  <i className="fas fa-phone mr-2"></i>{phone}
                </p>
                <p className="flex items-center mt-2">
                  <i className="fas fa-envelope mr-2"></i>{email}
                </p>
                <p className="flex items-center mt-2">
                  <i className="fas fa-map-marker-alt mr-2"></i>{address}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Language</h3>
                <ul className="text-sm">
                  {languagesToDisplay.map((language, index) => (
                    <li key={index}>{language.title} ({language.level})</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Expertise</h3>
                <ul className="text-sm">
                  <li>Management Skills</li>
                  <li>Creativity</li>
                  <li>Digital Marketing</li>
                  <li>Negotiation</li>
                  <li>Critical Thinking</li>
                  <li>Leadership</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Right section (Experience, Education, Skills) */}
          <div className="w-2/3 p-6">
            <div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-4">Experience</h3>
              {experienceToDisplay.map((exp, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-bold text-lg">{exp.title}</h4>
                  <p className="text-sm text-gray-600">{exp.company} - {exp.position} | {exp.date}</p>
                  <p className="text-sm mt-2">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-indigo-900 mb-4">Education</h3>
              {educationToDisplay.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-bold text-lg">{edu.degree}</h4>
                  <p className="text-sm text-gray-600">{edu.institution} | {edu.date}</p>
                  <p className="text-sm mt-2">
                    {edu.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-indigo-900 mb-4">Skills Summary</h3>
              {skillsToDisplay.map((skill, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-bold text-lg">{skill.title}</h4>
                  <h3 className='text-sm text-gray-600'>{skill.value}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;

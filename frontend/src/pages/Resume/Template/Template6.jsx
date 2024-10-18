import React from 'react';
import defaultData from "./defaultData.json";
const Resume = ({ data }) => {
  const skillsToDisplay = data?.skills?.length > 0 ? data.skills : defaultData.skills;
  const languagesToDisplay = data?.languages?.length > 0 ? data.languages : defaultData.languages;
  const educationToDisplay = data?.education?.length > 0 ? data.education : defaultData.education;
  const experienceToDisplay = data?.experience?.length > 0 ? data.experience : defaultData.experience;
  const title = data?.title || defaultData.title;
  const summary = data?.summary || defaultData.summary;
  const name = data?.personalInformation?.name || defaultData.personalInformation.name;
  const phone = data?.personalInformation?.phone || defaultData.personalInformation.phone;
  const email = data?.personalInformation?.email || defaultData.personalInformation.email;
  const address = data?.personalInformation?.address || defaultData.personalInformation.address;
  const image = data?.personalInformation?.image || defaultData.personalInformation.image;
  return (
    <div className="resume-cv w-[210mm] h-[297mm] bg-white p-8 rounded-lg shadow-lg flex">
      {/* Left Column */}
      <div className="col-span-1 bg-beige p-6">
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <img
            className="rounded-full w-40 h-40 border-4 border-white"
            src={image} // Replace with the actual image URL or import
            alt="Profile"
          />
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-bold uppercase text-gray-800">Contact</h2>

          <ul className="mt-4 space-y-2 text-gray-600">
            <li><i className="fas fa-phone"></i> {phone}</li>
            <li><i className="fas fa-envelope"></i> {email}</li>
            <li><i className="fas fa-globe"></i> {address}</li>
          </ul>
        </div>

        {/* Education */}
        <div className="mt-8">
          <h2 className="text-lg font-bold uppercase text-gray-800">Education</h2>
          {educationToDisplay.map((edu, index) => (
            <div className="mt-4 space-y-4" key={index}>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">{edu.institution}</h3>
                <p className="text-sm text-gray-600">{edu.date}</p>
                <p className="text-sm text-gray-600">{edu.degree}{edu.gpa ? `, GPA: ${edu.gpa}` : ''}</p>
                <p className="text-sm text-gray-600">{edu.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mt-8">
          <h2 className="text-lg font-bold uppercase text-gray-800">Skills</h2>
          {skillsToDisplay.map((skill, index) => (
            <div className="mt-4 space-y-4" key={index}>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">{skill.title}</h3>
                <p className="text-sm text-gray-600">{skill.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-2 p-6">
        {/* Name and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold uppercase text-gray-800">{name}</h1>
          <p className="text-lg text-gray-600">{title}</p>
          <p className="mt-4 text-sm text-gray-600">
            {summary}
          </p>
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-lg font-bold uppercase text-gray-800">Experience</h2>
          {experienceToDisplay.map((exp, index) => (
            <div className="mt-6 space-y-6" key={index}>
              <div>
                <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                <p className="text-sm text-gray-600">{exp.company} | {exp.date}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Language */}
        <div className="mt-8">
          <h2 className="text-lg font-bold uppercase text-gray-800">Language</h2>
          {languagesToDisplay.map((lang, index) => (
            <div className="mt-4 space-y-2" key={index}>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{lang.title}</span>
                <span className="text-sm text-gray-600">{lang.level}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Reference */}
        <div className="mt-8">
          <h2 className="text-lg font-bold uppercase text-gray-800">Reference</h2>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Alfredo Torres | Director</p>
            <p className="text-sm text-gray-600">Aldenaire & Partners</p>
            <p className="text-sm text-gray-600">+123-456-7890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;

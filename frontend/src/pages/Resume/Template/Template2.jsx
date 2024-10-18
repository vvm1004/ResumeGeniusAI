import React from "react";
import defaultData from "./defaultData.json";

const Resume = ({ data }) => {
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
    <div className="resume-cv w-[210mm] h-[297mm] bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg flex">
      {/* Name & Profile Image */}

      <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">
              {name}
            </h1>
            <p className="text-lg text-gray-500">{title}</p>
          </div>
          <img
            src={image}
            alt="Profile"
            className="w-20 h-20 rounded-full ml-auto"
          />
        </div>
        <div className=" grid grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="col-span-2 sm:col-span-1 flex flex-col justify-between ">
            {/* Contact Info */}
            <div className="mb-8">
              <ul className="text-sm text-gray-600 space-y-2">
                <li>📞 {phone}</li>
                <li>✉️ {email}</li>
                <li>🏠 {address}</li>
              </ul>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                SKILLS
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                {skillsToDisplay.map((skill, index) => (
                  <li key={index}>
                    <strong>{skill.title}:</strong> {skill.value}
                  </li>
                ))}
              </ul>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">EDUCATION</h3>

              {educationToDisplay.map((edu, index) => (
                <div className="mb-4" key={index}>
                  <p className="text-sm font-semibold">{edu.degree} in {edu.major}</p>
                  <p className="text-sm text-gray-600">
                    {edu.institution}, {edu.date} {edu.gpa ? `, GPA: ${edu.gpa}` : ''}
                  </p>
                  <p className="text-sm text-gray-600">{edu.description}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Right Section */}
          <div className="col-span-2 sm:col-span-1">
            {/* Profile */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                PROFILE
              </h3>
              <p className="text-sm text-gray-600">
                {summary}
              </p>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">EXPERIENCE</h3>

              {experienceToDisplay.map((exp, index) => (
                <div className="mb-6" key={index}>
                  <h4 className="text-sm font-semibold">{exp.title}</h4>
                  <p className="text-sm text-gray-600 italic mb-1">
                    {exp.company}, {exp.city}, {exp.date}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">{exp.description}</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {exp.responsibilities.map((responsibility, rIndex) => (
                      <li key={rIndex}>{responsibility}</li>
                    ))}
                  </ul>
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

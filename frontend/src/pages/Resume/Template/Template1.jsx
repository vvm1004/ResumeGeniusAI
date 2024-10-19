import React from "react";
import defaultData from "./defaultData.json";
const Resume = ({ data }) => {
  const skillsToDisplay = data?.skills?.length > 0 ? data.skills : defaultData.skills;
  const languagesToDisplay = data?.languages?.length > 0 ? data.languages : defaultData.languages;
  const educationToDisplay = data?.education?.length > 0 ? data.education : defaultData.education;
  const experienceToDisplay = data?.experience?.length > 0 ? data.experience : defaultData.experience;
  const title = data?.title || defaultData.title;
  // Defaulting personal information if missing
  const name = data?.personalInformation?.name || defaultData.personalInformation.name;
  const phone = data?.personalInformation?.phone || defaultData.personalInformation.phone;
  const email = data?.personalInformation?.email || defaultData.personalInformation.email;
  const address = data?.personalInformation?.address || defaultData.personalInformation.address;
  return (
    <div className="template w-[210mm] h-[297mm] bg-white p-8 rounded-lg shadow-lg flex">
      {/* Left Section */}
      <div className="w-1/3 bg-blue-900 text-white p-6 rounded-l-lg">
        <img
          src={data?.personalInformation?.image || "default-image-url"} // Thay thế bằng URL hình ảnh mặc định nếu không có dữ liệu
          alt="Profile"
          className="rounded-full w-28 h-28 mx-auto mb-4"
        />
        <h2 className="text-xl font-bold text-center mb-2">{name}</h2>
        <p className="text-center text-sm font-light mb-6">{title}</p>

        {/* Contact */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-2">CONTACT</h3>
          <p className="text-sm">📞 {phone}</p>
          <p className="text-sm">✉️ {email}</p>
          <p className="text-sm">🏠 {address}</p>
          {/* <p className="text-sm">🌐 www.reallygreatsite.com</p> */}
        </div>

        {/* Education */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-2">EDUCATION</h3>
          {educationToDisplay.map((edu, index) => (
            <p className="text-sm" key={index}>
              {edu.institution} <br />
              {edu.date} <br />
              {edu.degree}{edu.gpa ? `, GPA: ${edu.gpa}` : ''} <br />
              {edu.description}
            </p>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-2">SKILLS</h3>
          <ul className="text-sm list-disc list-inside">
            {skillsToDisplay.map((skill, index) => (
              <li key={index}>
                <strong>{skill.title}:</strong> {skill.value}
              </li>
            ))}
          </ul>
        </div>

        {/* Languages */}
        <div>
          <h3 className="font-semibold text-sm mb-2">LANGUAGES</h3>
          <ul className="text-sm list-disc list-inside">
            {languagesToDisplay.map((lang, index) => (
              <li key={index}>
                {lang.title} ({lang.level})
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-2/3 bg-white p-6">
        {/* Profile */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">PROFILE</h3>
          <p className="text-sm text-gray-600">
            {data?.summary || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation."}
          </p>
        </div>

        {/* Work Experience */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            WORK EXPERIENCE
          </h3>

          {experienceToDisplay.map((exp, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-semibold text-sm text-blue-900">
                {exp.company + " ( " + exp.title + " )"}
              </h4>
              <p className="text-sm text-gray-600 italic mb-1">
                {exp.position} | {exp.date}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                {exp.description}
              </p>
            </div>
          ))}
        </div>

        {/* Reference */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            REFERENCE
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-sm">Estelle Darcy</p>
              <p className="text-sm text-gray-600">Wardiere Inc. / CTO</p>
              <p className="text-sm text-gray-600">📞 123-456-7890</p>
              <p className="text-sm text-gray-600">
                ✉️ hello@reallygreatsite.com
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm">Harper Richard</p>
              <p className="text-sm text-gray-600">Wardiere Inc. / CEO</p>
              <p className="text-sm text-gray-600">📞 123-456-7890</p>
              <p className="text-sm text-gray-600">
                ✉️ hello@reallygreatsite.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;

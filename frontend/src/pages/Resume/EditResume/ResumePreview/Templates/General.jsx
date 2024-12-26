import React from "react";

const General = ({ data, selectedColor }) => {
  return (
    <div className="flex flex-row border border-gray-300 min-h-full w-full">
      {/* Sidebar */}
      <div
        className="bg-blue-900 text-white p-6 flex flex-col w-1/3 flex-shrink-0"
        style={{
          background:
            data?.settings?.colors?.background?.length > 0
              ? data.settings.colors.background[
                  data.settings.colors.background.length - 1
                ]
              : data?.template?.settings?.colors?.background?.[0] ||
                selectedColor,
        }}
      >
        {/* Avatar và Thông tin cá nhân */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              data.personalInformation?.image ||
              "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="rounded-full w-32 h-32 mb-4 border-4 border-white"
          />
          <h2 className="text-xl font-bold break-words">
            {data.personalInformation?.name || "Full Name"}
          </h2>
          <p className="break-words">
            {data.personalInformation?.email || "Email"}
          </p>
        </div>

        {/* Liên hệ */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3 border-b-2 border-white">
            Contact Information
          </h3>
          {data.personalInformation?.phone && (
            <p className="break-words">
              Phone: {data.personalInformation.phone}
            </p>
          )}
          {data.personalInformation?.address && (
            <p className="break-words">
              Address: {data.personalInformation.address}
            </p>
          )}
          {data.personalInformation?.github && (
            <p className="break-words">
              GitHub: {data.personalInformation.github}
            </p>
          )}
          {data.personalInformation?.linkedin && (
            <p className="break-words">
              LinkedIn: {data.personalInformation.linkedin}
            </p>
          )}
        </div>

        {/* Kỹ năng */}
        {data.skills?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-white">
              Skills
            </h3>
            <ul className="list-disc w-full max-w-full">
              {data.skills.map((skill) => (
                <li
                  key={skill._id}
                  className="break-words overflow-wrap-anywhere w-full"
                >
                  {skill.title}
                  <span className="break-words overflow-wrap-anywhere">
                    : {skill.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ngôn ngữ */}
        {data.languages?.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-3 border-b-2 border-white">
              Languages
            </h3>
            <ul className="list-disc ml-4">
              {data.languages.map((lang) => (
                <li key={lang._id} className="break-words">
                  {lang.title} - {lang.level}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Awards */}
        {data.awards?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-white">
              Awards
            </h3>
            <ul className="list-disc ml-4">
              {data.awards.map((award, index) => (
                <li key={index} className="break-words">
                  {award.title} - {award.issuer} ({award.date})
                  <p className="break-words">{award.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {data.certifications?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-white">
              Certifications
            </h3>
            <ul className="list-disc ml-4">
              {data.certifications.map((cert, index) => (
                <li key={index} className="break-words">
                  {cert.name} - {cert.year}
                  {cert.link && (
                    <p className="break-words">
                      Link:{" "}
                      <a href={cert.link} className="text-blue-600">
                        {cert.link}
                      </a>
                    </p>
                  )}
                  <p className="break-words">{cert.details}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Custom Fields */}
        {data.customFields?.length > 0 && (
          <div className="mb-6">
            {data.customFields.map((field, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-lg mb-3 border-b-2 border-white">
                  {field.title}{" "}
                  {/* This will display the title of each custom field */}
                </h3>
                <ul className="list-disc ml-4">
                  <li className="break-words">
                    {field.value} ({field.date})
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nội dung chính */}
      <div className="bg-white p-6 flex-grow">
        {/* Tiêu đề và Thông tin chung */}
        <h1 className="text-3xl font-bold mb-4 break-words">
          {data.title || "CV Title"}
        </h1>
        <h2 className="text-xl text-gray-600 mb-6 break-words">
          {data.summary || "Summary Information"}
        </h2>

        {/* Kinh nghiệm làm việc */}
        {data.experience?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-blue-900">
              Work Experience
            </h3>
            {data.experience.map((exp) => (
              <div key={exp._id} className="mb-4">
                <p className="font-bold break-words">{exp.company}</p>
                <p className="italic text-gray-600 break-words">
                  {exp.position} ({exp.date})
                </p>
                <p className="mb-2 text-gray-700 break-words">
                  {exp.description}
                </p>{" "}
                {/* Mô tả năng lực */}
                <ul className="list-disc ml-4">
                  {exp.responsibilities.map((res, index) => (
                    <li key={index} className="break-words">
                      {res}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Học vấn */}
        {data.education?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-blue-900">
              Education
            </h3>
            {data.education.map((edu) => (
              <div key={edu._id} className="mb-3">
                <p className="font-bold break-words">
                  {edu.degree} - {edu.major}
                </p>
                <p className="break-words">
                  {edu.institution} ({edu.date})
                </p>
                <p className="break-words">GPA: {edu.gpa}</p>
                <p className="mb-2 text-gray-700 break-words">
                  {edu.description}
                </p>{" "}
                {/* Mô tả năng lực */}
              </div>
            ))}
          </div>
        )}

        {/* Dự án */}
        {data.projects?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-blue-900">
              Projects
            </h3>
            {data.projects.map((project) => (
              <div key={project._id} className="mb-4">
                <p className="font-bold break-words">{project.title}</p>
                <p className="mb-2 text-gray-700 break-words">
                  {project.description}
                </p>{" "}
                {/* Mô tả năng lực */}
                <p className="break-words">
                  Technologies: {project.technologies}
                </p>
                {project.githubLink && (
                  <p className="break-words">
                    GitHub:{" "}
                    <a href={project.githubLink} className="text-blue-600">
                      {project.githubLink}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Người tham khảo */}
        {data.references?.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-3 border-b-2 border-blue-900">
              References
            </h3>
            {data.references.map((ref) => (
              <div key={ref._id} className="mb-3">
                <p className="font-bold break-words">{ref.name}</p>
                <p className="break-words">
                  {ref.position} at {ref.organization}
                </p>
                <p className="break-words">Contact: {ref.contact}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default General;

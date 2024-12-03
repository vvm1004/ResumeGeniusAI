import React from "react";

const General = ({ data, selectedColor }) => {
  return (
    <div className="flex flex-row border border-gray-300 min-h-screen w-full">
      {/* Sidebar */}
      <div
        className="bg-blue-900 text-white p-6 flex flex-col w-1/3"
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
            {data.personalInformation?.name || "Họ và Tên"}
          </h2>
          <p className="break-words">
            {data.personalInformation?.email || "Email"}
          </p>
        </div>

        {/* Liên hệ */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3 border-b-2 border-white">
            Liên hệ
          </h3>
          {data.personalInformation?.phone && (
            <p className="break-words">
              Điện thoại: {data.personalInformation.phone}
            </p>
          )}
          {data.personalInformation?.address && (
            <p className="break-words">
              Địa chỉ: {data.personalInformation.address}
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
              Kỹ năng
            </h3>
            <ul className="list-disc w-full max-w-full">
              {data.skills.map((skill) => (
                <li
                  key={skill._id.$oid}
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
              Ngôn ngữ
            </h3>
            <ul className="list-disc ml-4">
              {data.languages.map((lang) => (
                <li key={lang._id.$oid} className="break-words">
                  {lang.title} - {lang.level}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Nội dung chính */}
      <div className="bg-white p-6 flex-grow">
        {/* Tiêu đề và Thông tin chung */}
        <h1 className="text-3xl font-bold mb-4 break-words">
          {data.title || "Tiêu đề CV"}
        </h1>
        <h2 className="text-xl text-gray-600 mb-6 break-words">
          {data.summary || "Tóm tắt thông tin"}
        </h2>

        {/* Kinh nghiệm làm việc */}
        {data.experience?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-blue-900">
              Kinh nghiệm làm việc
            </h3>
            {data.experience.map((exp) => (
              <div key={exp._id.$oid} className="mb-4">
                <p className="font-bold break-words">{exp.company}</p>
                <p className="italic text-gray-600 break-words">
                  {exp.position} ({exp.date})
                </p>
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
              Học vấn
            </h3>
            {data.education.map((edu) => (
              <div key={edu._id.$oid} className="mb-3">
                <p className="font-bold break-words">
                  {edu.degree} - {edu.major}
                </p>
                <p className="break-words">
                  {edu.institution} ({edu.date})
                </p>
                <p className="break-words">GPA: {edu.gpa}</p>
              </div>
            ))}
          </div>
        )}

        {/* Dự án */}
        {data.projects?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-blue-900">
              Dự án
            </h3>
            {data.projects.map((project) => (
              <div key={project._id.$oid} className="mb-4">
                <p className="font-bold break-words">{project.title}</p>
                <p className="break-words">{project.description}</p>
                <p className="break-words">Công nghệ: {project.technologies}</p>
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
              Người tham khảo
            </h3>
            {data.references.map((ref) => (
              <div key={ref._id.$oid} className="mb-3">
                <p className="font-bold break-words">{ref.name}</p>
                <p className="break-words">
                  {ref.position} tại {ref.organization}
                </p>
                <p className="break-words">Liên hệ: {ref.contact}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default General;

import React from "react";

const Normal = ({ data, selectedColor }) => {
  return (
    <div className="flex flex-row bg-gradient-to-r from-blue-900 to-blue-600 min-h-full max-w-[1000px] mx-auto">
      {/* Sidebar */}
      <div
        className="bg-white text-black p-6 flex flex-col w-1/4 rounded-lg shadow-lg"
        style={{ background: `${selectedColor}` || "#1e3a8a" }}
      >
        {/* Avatar và Thông tin cá nhân */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={
              data.personalInformation?.image ||
              "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="rounded-full w-32 h-32 mb-4 border-4 border-white shadow-xl"
          />
          <h2 className="text-2xl font-bold">
            {data.personalInformation?.name || "Họ và Tên"}
          </h2>
          <p className="text-gray-700">
            {data.personalInformation?.email || "Email"}
          </p>
        </div>

        {/* Liên hệ */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3 text-blue-800">Liên hệ</h3>
          {data.personalInformation?.phone && (
            <p className="text-sm">
              Điện thoại: {data.personalInformation.phone}
            </p>
          )}
          {data.personalInformation?.address && (
            <p className="text-sm">
              Địa chỉ: {data.personalInformation.address}
            </p>
          )}
          {data.personalInformation?.github && (
            <p className="text-sm">GitHub: {data.personalInformation.github}</p>
          )}
          {data.personalInformation?.linkedin && (
            <p className="text-sm">
              LinkedIn: {data.personalInformation.linkedin}
            </p>
          )}
        </div>

        {/* Kỹ năng */}
        {data.skills?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-blue-800">
              Kỹ năng
            </h3>
            <ul className="list-disc ml-4 text-sm">
              {data.skills.map((skill) => (
                <li key={skill._id.$oid}>
                  {skill.title}: {skill.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ngôn ngữ */}
        {data.languages?.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3 text-blue-800">
              Ngôn ngữ
            </h3>
            <ul className="list-disc ml-4 text-sm">
              {data.languages.map((lang) => (
                <li key={lang._id.$oid}>
                  {lang.title} - {lang.level}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Nội dung chính */}
      <div className="bg-white p-6 flex-grow rounded-lg shadow-xl ml-6">
        {/* Tiêu đề và Thông tin chung */}
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
          {data.title || "Tiêu đề CV"}
        </h1>
        <h2 className="text-xl text-gray-600 mb-6">
          {data.summary || "Tóm tắt thông tin"}
        </h2>

        {/* Kinh nghiệm làm việc */}
        {data.experience?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-blue-800">
              Kinh nghiệm làm việc
            </h3>
            {data.experience.map((exp) => (
              <div key={exp._id.$oid} className="mb-4">
                <p className="font-semibold">{exp.company}</p>
                <p className="italic text-gray-600">
                  {exp.position} ({exp.date})
                </p>
                <ul className="list-disc ml-4 text-sm">
                  {exp.responsibilities.map((res, index) => (
                    <li key={index}>{res}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Học vấn */}
        {data.education?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-blue-800">
              Học vấn
            </h3>
            {data.education.map((edu) => (
              <div key={edu._id.$oid} className="mb-3">
                <p className="font-semibold">
                  {edu.degree} - {edu.major}
                </p>
                <p className="text-sm">
                  {edu.institution} ({edu.date})
                </p>
                <p className="text-sm">GPA: {edu.gpa}</p>
              </div>
            ))}
          </div>
        )}

        {/* Dự án */}
        {data.projects?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-blue-800">Dự án</h3>
            {data.projects.map((project) => (
              <div key={project._id.$oid} className="mb-4">
                <p className="font-semibold">{project.title}</p>
                <p className="text-sm">{project.description}</p>
                <p className="text-sm">Công nghệ: {project.technologies}</p>
                {project.githubLink && (
                  <p className="text-sm">
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
            <h3 className="font-semibold text-lg mb-3 text-blue-800">
              Người tham khảo
            </h3>
            {data.references.map((ref) => (
              <div key={ref._id.$oid} className="mb-3">
                <p className="font-semibold">{ref.name}</p>
                <p className="text-sm">
                  {ref.position} tại {ref.organization}
                </p>
                <p className="text-sm">Liên hệ: {ref.contact}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Normal;

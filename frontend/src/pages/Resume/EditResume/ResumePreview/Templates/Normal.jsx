import React from "react";

const Resume = ({ data, selectedColor }) => {
  return (
    <div className="flex h-full w-full border border-gray-300">
      {/* Sidebar */}
      <div
        className="bg-[#0A0A0A] text-white p-6 w-1/3 flex flex-col"
        // style={{
        //   background:
        //     data?.settings?.colors?.background?.length > 0
        //       ? data.settings.colors.background[
        //           data.settings.colors.background.length - 1
        //         ]
        //       : data?.template?.settings?.colors?.background?.[0] ||
        //         selectedColor,
        // }}
      >
        {/* Contact */}
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-wider">CONTACT</h2>
          <p className="mt-2">
            {data.personalInformation?.phone || "123-456-7890"}
          </p>
          <p>{data.personalInformation?.email || "example@mail.com"}</p>
          <p>
            {data.personalInformation?.address ||
              "123 Anywhere St, City, ST 12345"}
          </p>
          <p>{data?.personalInformation?.website}</p>
        </div>

        {/* Profile Image */}
        <div className="flex mb-6 justify-center">
          <img
            src={
              data.personalInformation?.image ||
              "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="rounded-full w-32 h-32 mx-auto mb-4 border-4 border-white"
          />
        </div>

        {/* Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-wider">SUMMARY</h2>
          <p className="mt-2 text-gray-400">
            {data.summary || "This is a placeholder summary for your resume."}
          </p>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-wider">SKILLS</h2>
          <ul className="mt-2 list-disc ml-4">
            {data.skills?.map((skill, index) => (
              <li key={index} className="text-gray-400">
                {skill.title}
              </li>
            )) || (
              <>
                <li className="text-gray-400">Skill 1</li>
                <li className="text-gray-400">Skill 2</li>
              </>
            )}
          </ul>
        </div>

        {/* Languages */}
        <div>
          <h2 className="text-lg font-bold tracking-wider">LANGUAGES</h2>
          <ul className="mt-2 list-disc ml-4">
            {data.languages?.map((lang, index) => (
              <li key={index} className="text-gray-400">
                {lang.title} - {lang.level}
              </li>
            )) || (
              <>
                <li className="text-gray-400">English - Fluent</li>
                <li className="text-gray-400">Spanish - Intermediate</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white p-8 w-2/3">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-wider">
            {data.personalInformation?.name || "Full Name"}
          </h1>
          <h2 className="text-2xl text-gray-600">
            {data.personalInformation?.position || "Your Job Title"}
          </h2>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-lg font-bold tracking-wider">EDUCATION</h2>
          <div className="mt-4">
            {data.education?.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold">{edu.degree}</h3>
                <p className="italic text-gray-600">
                  {edu.institution} ({edu.date})
                </p>
              </div>
            )) || (
              <>
                <div>
                  <h3 className="font-bold">Master of Science</h3>
                  <p className="italic text-gray-600">
                    Example University (2014 - 2016)
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">Bachelor of Science</h3>
                  <p className="italic text-gray-600">
                    Example University (2010 - 2014)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <h2 className="text-lg font-bold tracking-wider">EXPERIENCE</h2>
          <div className="mt-4">
            {data.experience?.map((exp, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold">{exp.position}</h3>
                <p className="italic text-gray-600">
                  {exp.company} ({exp.date})
                </p>
                <ul className="mt-2 list-disc ml-4">
                  {exp.responsibilities.map((res, i) => (
                    <li key={i} className="text-gray-700">
                      {res}
                    </li>
                  ))}
                </ul>
              </div>
            )) || (
              <>
                <div>
                  <h3 className="font-bold">Applications Developer</h3>
                  <p className="italic text-gray-600">
                    Example Company (2016 - Present)
                  </p>
                  <ul className="mt-2 list-disc ml-4">
                    <li className="text-gray-700">Database administration</li>
                    <li className="text-gray-700">
                      Built scalable web applications
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* References */}
        <div>
          <h2 className="text-lg font-bold tracking-wider">REFERENCES</h2>
          <div className="mt-4">
            {data.references?.map((ref, index) => (
              <div key={index} className="mb-4">
                <p className="font-bold">{ref.name}</p>
                <p className="italic text-gray-600">{ref.position}</p>
                <p>{ref.contact}</p>
              </div>
            )) || (
              <>
                <div>
                  <p className="font-bold">Kimberly Nguyen</p>
                  <p className="italic text-gray-600">Marketing Manager</p>
                  <p>Phone: 123-456-7890</p>
                  <p>Email: hello@example.com</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;

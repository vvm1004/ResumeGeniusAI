import React from "react";

function Template3({ data }) {
  return (
    <div className="p-6">
      {/* Personal Information */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          {data?.personalInformation?.name}
        </h1>
        <p className="text-lg text-gray-600">
          {data?.personalInformation?.email} |{" "}
          {data?.personalInformation?.phone}
        </p>
        <p className="text-lg text-gray-600">
          {data?.personalInformation?.github} |{" "}
          {data?.personalInformation?.linkedin}
        </p>
        <p className="text-lg text-gray-600">
          {data?.personalInformation?.address}
        </p>
      </div>

      <hr className="my-6" />

      {/* Summary */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">
          Professional Summary
        </h2>
        <p className="mt-2 text-gray-700">{data?.summary}</p>
      </section>

      <hr className="my-6" />

      {/* Experience */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">Experience</h2>
        {data?.experience?.map((exp) => (
          <div key={exp._id} className="mt-4">
            <h3 className="text-lg font-bold text-gray-900">
              {exp.title} - {exp.company}
            </h3>
            <p className="text-sm text-gray-500">{exp.date}</p>
            <p className="text-md text-gray-700">{exp.description}</p>
            <ul className="list-disc list-inside text-gray-700 mt-2">
              {exp.responsibilities?.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <hr className="my-6" />

      {/* Education */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">Education</h2>
        {data?.education?.map((edu) => (
          <div key={edu._id} className="mt-4">
            <h3 className="text-lg font-bold text-gray-900">
              {edu.degree} - {edu.major}
            </h3>
            <p className="text-md text-gray-700">{edu.institution}</p>
            <p className="text-sm text-gray-500">{edu.date}</p>
            <p className="text-md text-gray-700">GPA: {edu.gpa}</p>
          </div>
        ))}
      </section>

      <hr className="my-6" />

      {/* Projects */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">Projects</h2>
        {data?.projects?.map((project) => (
          <div key={project._id} className="mt-4">
            <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
            <p className="text-md text-gray-700">{project.description}</p>
            <p className="text-sm text-gray-500">
              Technologies: {project.technologies}
            </p>
            <p className="text-sm text-gray-500">
              GitHub:{" "}
              <a href={project.githubLink} className="text-blue-600">
                {project.githubLink}
              </a>
            </p>
            {project.demo && (
              <p className="text-sm text-gray-500">
                Demo:{" "}
                <a href={project.demo} className="text-blue-600">
                  {project.demo}
                </a>
              </p>
            )}
          </div>
        ))}
      </section>

      <hr className="my-6" />

      {/* Skills */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">Skills</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          {data?.skills?.map((skill) => (
            <li key={skill._id} className="mt-2">
              <span className="font-bold">{skill.title}:</span> {skill.value}
            </li>
          ))}
        </ul>
      </section>

      <hr className="my-6" />

      {/* Languages */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">Languages</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          {data?.languages?.map((language) => (
            <li key={language._id} className="mt-2">
              <span className="font-bold">{language.title}:</span>{" "}
              {language.level}
            </li>
          ))}
        </ul>
      </section>

      <hr className="my-6" />

      {/* Interests */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">Interests</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          {data?.interests?.map((interest) => (
            <li key={interest._id}>
              <span className="font-bold">{interest.title}:</span>{" "}
              {interest.description}
            </li>
          ))}
        </ul>
      </section>

      <hr className="my-6" />

      {/* References */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">References</h2>
        {data?.references?.map((ref) => (
          <div key={ref._id} className="mt-4">
            <h3 className="text-lg font-bold text-gray-900">{ref.name}</h3>
            <p className="text-md text-gray-700">
              {ref.position} - {ref.organization}
            </p>
            <p className="text-sm text-gray-500">Contact: {ref.contact}</p>
          </div>
        ))}
      </section>

      <hr className="my-6" />

      {/* Certifications */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">Certifications</h2>
        {data?.certifications?.map((cert) => (
          <div key={cert._id} className="mt-4">
            <h3 className="text-lg font-bold text-gray-900">{cert.name}</h3>
            <p className="text-sm text-gray-500">Year: {cert.year}</p>
            <p className="text-md text-gray-700">Details: {cert.details}</p>
            <p className="text-sm text-blue-600">
              <a href={cert.link}>{cert.link}</a>
            </p>
          </div>
        ))}
      </section>

      <hr className="my-6" />

      {/* Custom Fields */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">
          Additional Information
        </h2>
        {data?.customFields?.map((field) => (
          <div key={field._id} className="mt-4">
            <h3 className="text-lg font-bold text-gray-900">{field.title}</h3>
            <p className="text-md text-gray-700">{field.value}</p>
            <p className="text-sm text-gray-500">{field.date}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Template3;

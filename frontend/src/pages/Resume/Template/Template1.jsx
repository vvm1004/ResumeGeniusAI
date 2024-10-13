import React from "react";
import "./style1.scss"; // Link your CSS file if necessary
const Resume = ({ data }) => {
  function formatMonthYear(monthYear) {
    if (!monthYear) return "";
    const [year, month] = monthYear.split("-");
    const date = new Date(year, month - 1);
    const options = { year: "numeric", month: "short" };
    return date.toLocaleDateString("en-US", options);
  }
  const getLevelLabel = (rating) => {
    switch (rating) {
      case 1:
        return "Novice";
      case 2:
        return "Beginner";
      case 3:
        return "Skillful";
      case 4:
        return "Experienced";
      case 5:
        return "Expert";
      default:
        return "Unknown";
    }
  };
  return (
    <>
      {/* <div className="resume-container">
        <div className="t1">
          <section className="main-section">
            <div className="left-part">
              <div className="photo-container">
                {data?.image && (
                  <div className="w-32 h-32 overflow-hidden">
                    <img
                      className="object-cover w-full h-full"
                      src={data.image}
                      alt="Uploaded image"
                    />
                  </div>
                )}
              </div>
              <div className="contact-container">
                <h2 className="title">Contact Me</h2>
                <div className="contact-list">
                  <div className="icon-container">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div className="contact-text">
                    <p>{data.address}</p>
                  </div>
                </div>
                <div className="contact-list">
                  <div className="icon-container">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div className="contact-text">
                    <p>{data.email}</p>
                  </div>
                </div>
                <div className="contact-list">
                  <div className="icon-container">
                    <i className="bi bi-laptop"></i>
                  </div>
                  <div className="contact-text">
                    <p>
                      {data.city} - {data.country}
                    </p>
                  </div>
                </div>
                <div className="contact-list">
                  <div className="icon-container">
                    <i className="bi bi-linkedin"></i>
                  </div>
                  <div className="contact-text">
                    <p>@reallygreatsite</p>
                  </div>
                </div>
              </div>

              <div className="education-container">
                <h2 className="title">Education</h2>
                {data?.education && data.education.length > 0 ? (
                  data.education.map((item, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="college-name">
                        {item.degree} from {item.universityName}, {item.city}
                      </h3>
                      <div className="education-date">
                        {formatMonthYear(item.startDate)}—
                        {formatMonthYear(item.endDate)}
                      </div>
                      {item.description && (
                        <div
                          className="mt-2 text-gray-700"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No education history available.
                  </p>
                )}
              </div>

              <div className="skills-container">
                <h2 className="title">Skills</h2>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Skills</h2>

                  {data?.skills && data.skills.length > 0 ? (
                    data.skills.map((item, index) => (
                      <div key={index} className="mb-6">
                        <h3 className="text-lg font-bold">
                          {item.name || "(No specified skill)"} -{" "}
                          {getLevelLabel(item.rating)}
                        </h3>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No skills available.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="right-part">
              <div className="banner">
                <h1 className="firstname">{data.firstName}</h1>
                <h1 className="lastname">{data.lastName}</h1>
                <p className="position">{data.jobTitle}</p>
              </div>

              <div className="work-container">
                <h2 className="title text-left">Work Experience</h2>
                <div className="work">
                  <div className="job-date">
                    <p className="job">Job position here</p>
                    <p className="date">2019 - 2022</p>
                  </div>
                  <h2 className="company-name">Company Name | Location</h2>
                  <p className="work-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pharetra in lorem at laoreet. Donec hendrerit libero
                    eget est tempor, quis tempus arcu elementum. In elementum
                    elit at dui tristique feugiat.
                  </p>
                </div>

                <div className="work">
                  <div className="job-date">
                    <p className="job">Job position here</p>
                    <p className="date">2019 - 2022</p>
                  </div>
                  <h2 className="company-name">Company Name | Location</h2>
                  <p className="work-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pharetra in lorem at laoreet. Donec hendrerit libero
                    eget est tempor, quis tempus arcu elementum. In elementum
                    elit at dui tristique feugiat.
                  </p>
                </div>

                <div className="work">
                  <div className="job-date">
                    <p className="job">Job position here</p>
                    <p className="date">2019 - 2022</p>
                  </div>
                  <h2 className="company-name">Company Name | Location</h2>
                  <p className="work-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pharetra in lorem at laoreet. Donec hendrerit libero
                    eget est tempor, quis tempus arcu elementum. In elementum
                    elit at dui tristique feugiat.
                  </p>
                </div>
              </div>

              <div className="references-container">
                <h2 className="title text-left">References</h2>
                <div className="references">
                  <div className="left-references">
                    <h4 className="name">Name Surname</h4>
                    <p className="company-name">Job position, Company Name</p>
                    <div className="phone">
                      <div className="phone-text">
                        <p>Phone:</p>
                        <p>Email:</p>
                      </div>
                      <div className="phone-number">
                        <p>123-456-7890</p>
                        <p>hello@reallygreatsite.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="right-references">
                    <h4 className="name">Name Surname</h4>
                    <p className="company-name">Job position, Company Name</p>
                    <div className="phone">
                      <div className="phone-text">
                        <p>Phone:</p>
                        <p>Email:</p>
                      </div>
                      <div className="phone-number">
                        <p>123-456-7890</p>
                        <p>hello@reallygreatsite.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div> */}
    </>
  );
};

export default Resume;

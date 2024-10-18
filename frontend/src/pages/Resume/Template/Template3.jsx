import React from "react";
// import { FaLocationDot } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { MdEmail } from "react-icons/md";
import defaultData from "./defaultData.json";

const Resume = ({data}) => {
  const skillsToDisplay = data?.skills && data.skills.length > 0
  ? data.skills
  : defaultData.skills;

const languagesToDisplay = data?.languages && data.languages.length > 0
  ? data.languages
  : defaultData.languages;

const educationToDisplay = data?.education && data.education.length > 0
  ? data.education
  : defaultData.education;

const experienceToDisplay = data?.experience && data.experience.length > 0
  ? data.experience
  : defaultData.experience;
  return (
    <>
      <div className="resume-cv w-[210mm] h-[297mm] bg-white p-8 rounded-lg shadow-lg flex">
        <div className="flex w-full h-full bg-white text-xl">
          <div className="bg-gray-300 p-4 border border-gray-200 w-1/3">
            <div className="flex justify-center mb-6">
              <img
                src="https://2sao.vietnamnetjsc.vn/images/2024/10/09/14/59/pu-1.jpg"
                alt=""
                className="w-20 h-20 rounded-full"
              />
            </div>
            <div className=" mb-4">
              <div className="bg-black text-white p-2 text-xl font-bold text-center mb-3">
                CONTACT ME
              </div>
              <div className="py-4">
                <div className="flex mb-2 gap-2">
                  <MdEmail /> {data?.personalInformation?.email || "hello@gmail.com"}
                </div>
                <div className="flex mb-2 gap-2">
                  {/* <FaLocationDot /> */}
                  Address:
                </div>
                <div className="flex mb-2 gap-2">
                  <FaPhoneAlt />
                  Phone:{" "}
                </div>
                <div className="flex mb-2 gap-2">
                  <FaGithub />
                  Github:{" "}
                </div>
                <div className="flex mb-2 gap-2">
                  <FaLinkedin />
                  Linkedin:{" "}
                </div>
                <div className="flex mb-2 gap-2">
                  <CgWebsite />
                  Social Link:{" "}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="bg-black text-white p-2 text-xl font-bold text-center mb-3">
                EDUCATION
              </div>
              <div className="py-4">
                <div className="flex mb-2 gap-2">Degree</div>
                <div className="flex mb-2 gap-2">Major</div>
                <div className="flex mb-2 gap-2">Institution</div>
                <div className="flex mb-2 gap-2">GPA</div>
                <div className="flex mb-2 gap-2">Date</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="bg-black text-white p-2 text-xl font-bold text-center mb-3">
                SKILLS
              </div>
            </div>
          </div>
          <div className="p-8 border border-gray-200 w-2/3">
            <div className="font-open-sans border-b border-gray-300">
              <div className="text-gray-700 mb-9">
                <div className="text-8xl font-bold mb-6 tracking-widest">
                  Ngoc Dat
                </div>
                <div className="text-8xl tracking-widest">Doan</div>
              </div>
              <div className="text-center tracking-widest text-4xl text-gray-500">
                Developer
              </div>
            </div>
            <div className="workeperience">
              <div className="bg-black text-white p-2 text-xl font-bold text-center mb-3">
                WORK EXPERIENCE
              </div>
              <div className="py-4">
                <div className="flex mb-2 gap-2">Position</div>
                <div className="flex mb-2 gap-2">Company</div>
                <div className="flex mb-2 gap-2">Date</div>
              </div>
            </div>
            <div className="references"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Resume;

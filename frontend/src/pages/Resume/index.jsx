import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa";
import { BsFiletypeDocx } from "react-icons/bs";

const DashboardResumes = () => {
  const [data, setData] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState("resumes");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/resumes"
        );
        setData(response.data.data.result);
      } catch {
        console.log("Error!");
      }
    };
    fetchApi();
  }, []);

  const handleNewResumeClick = () => {
    const confirmCreate = window.confirm("Bạn có tạo CV mới không?");

    if (confirmCreate) {
      // const newResume = {
      //   _id: Date.now().toString(),
      //   resumeId: `RES${Math.floor(Math.random() * 100000)}`,
      //   updatedAt: new Date().toISOString(),
      // };

      // setData((prevData) => [...prevData, newResume]);

      navigate(`edit/${newResume._id}`);
    }
  };

  const handleMenuClick = (menuItem, path) => {
    setActiveMenuItem(menuItem);
    navigate(path);
  };

  const handleResumeClick = async (id) => {
    const confirmEdit = window.confirm("Bạn có muốn chỉnh sửa CV này không?");
    if (confirmEdit) {
      navigate(`edit/${id}`);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/6 p-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto z-10">
        <div className="flex justify-between items-center">
          <img
            className="w-12 h-12 object-contain border-2 rounded-full font-12"
            src="https://tse2.mm.bing.net/th?id=OIP.xv5ky4lYh1TkiIZW6wwYJAAAAA&pid=Api&P=0&h=180"
            alt="Ảnh đại diện"
          />
          <div className="text-center">
            <h2 className="font-bold">Tạ Đình Tài</h2>
            <h3 className="text-gray-500">Set your target role</h3>
          </div>
        </div>
        <div className="mt-8">
          <ul className="text-gray-600 font-medium">
            <li
              className={`flex items-center p-2 text-left w-full hover:rounded-md hover:bg-blue-100 cursor-pointer ${
                activeMenuItem === "dashboard" ? "rounded-md bg-blue-100" : ""
              }`}
              onClick={() => handleMenuClick("dashboard", "/dashboard")}
            >
              <MdDashboard className="mr-4 text-xl" /> Dashboard
            </li>
            <li
              className={`flex items-center p-2 text-left w-full hover:rounded-md hover:bg-blue-100 cursor-pointer ${
                activeMenuItem === "resumes" ? "rounded-md bg-blue-100" : ""
              }`}
              onClick={() => handleMenuClick("resumes", "/resumes")}
            >
              <IoDocumentTextOutline className="mr-4 text-xl" />My Resumes
            </li>
            <li
              className={`flex items-center p-2 text-left w-full hover:rounded-md hover:bg-blue-100 cursor-pointer ${
                activeMenuItem === "recommended" ? "rounded-md bg-blue-100" : ""
              }`}
              onClick={() => handleMenuClick("recommended", "/recommended")}
            >
              <IoDocumentTextOutline className="mr-4 text-xl" /> Recommended
              Jobs
            </li>
            <li
              className={`flex items-center p-2 text-left w-full hover:rounded-md hover:bg-blue-100 cursor-pointer ${
                activeMenuItem === "jobTracked" ? "rounded-md bg-blue-100" : ""
              }`}
              onClick={() => handleMenuClick("jobTracked", "/jobTracked")}
            >
              <IoDocumentTextOutline className="mr-4 text-xl" /> Job Tracked
            </li>
            <li
              className={`flex items-center p-2 text-left w-full hover:rounded-md hover:bg-blue-100 cursor-pointer ${
                activeMenuItem === "interviewPrep" ? "rounded-md bg-blue-100" : ""
              }`}
              onClick={() => handleMenuClick("interviewPrep", "/interviewPrep")}
            >
              <IoDocumentTextOutline className="mr-4 text-xl" /> Interview Prep
            </li>
            <li
              className={`flex items-center p-2 text-left w-full hover:rounded-md hover:bg-blue-100 cursor-pointer ${
                activeMenuItem === "dashboard" ? "rounded-md bg-blue-100" : ""
              }`}
              onClick={() => handleMenuClick("dashboard", "/dashboard")}
            >
              <IoIosMore className="mr-4 text-xl" /> Other
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="ml-6 flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Resumes</h1>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg">
            + Create New
          </button>
        </div>

        <div className="rounded-lg grid grid-cols-2 gap-4">
          {data && data.length > 0 ? (
            data.map(
              (resume) =>
                resume._id &&
                resume.title && (
                  <div
                    className="w-full flex items-center p-4 cursor-pointer"
                    key={resume._id}
                  >
                    <div
                      className="mr-6"
                      onClick={() => handleResumeClick(resume._id)}
                    >
                      <img
                        src={
                          resume.image ||
                          "https://th.bing.com/th/id/OIP.wzvz7KNJz_DYS_M6MibRXAAAAA?rs=1&pid=ImgDetMain"
                        }
                        alt="Resume"
                        className="w-44 h-60 object-cover border-2"
                      />
                    </div>
                    <div className="flex-1 pl-4">
                      <h2
                        className="text-xl font-bold"
                        onClick={() => handleResumeClick(resume._id)}
                      >
                        {resume.title}
                      </h2>
                      <div
                        className="text-gray-500"
                        onClick={() => handleResumeClick(resume._id)}
                      >
                        Updated{" "}
                        {resume.updatedAt
                          ? new Date(resume.updatedAt).toLocaleString()
                          : "Unknown"}
                      </div>
                      <div className="mt-2 text-green-600 font-medium">
                        {resume.score !== undefined ? resume.score : 100}% Your
                        resume score
                      </div>

                      <div className="mt-4">
                        <button className="text-blue-600 font-medium flex items-center">
                          Tailor to job listing
                          <span className="ml-2 bg-gray-200 text-xs px-2 py-1 rounded-full">
                            NEW
                          </span>
                        </button>
                        <button className="flex items-center block mt-2 text-blue-600 font-medium">
                          <FaRegFilePdf className="mr-2 text-xl" />
                          Download PDF
                        </button>
                        <button className="flex items-center block mt-2 text-blue-600 font-medium">
                          <BsFiletypeDocx className="mr-2 text-xl" />
                          Export to DOCX
                        </button>
                        <button className="flex items-center block mt-2 text-blue-600 font-medium">
                          <IoIosMore className="mr-2 text-xl" />
                          More
                        </button>
                      </div>
                    </div>
                  </div>
                )
            )
          ) : (
            <></>
          )}

          <div className="w-full flex items-center p-4 cursor-pointer">
            <div
              className="w-44 h-60 border border-dashed rounded-lg h-full flex justify-center items-center cursor-pointer"
              onClick={handleNewResumeClick}
            >
              <span className="w-16 h-16 text-blue-600 text-3xl bg-gray-200 rounded-full flex justify-center items-center">
                +
              </span>
            </div>

            <div className="flex-1 p-5">
              <div className="text-gray-700 text-2xl">New Resume</div>
              <div className="text-gray-400 text-sm mt-2">
                Create a tailored resume for each job application. Double your
                chances of getting hired!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardResumes;

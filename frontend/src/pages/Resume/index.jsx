import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdDriveFileRenameOutline,
  MdOutlineFindInPage,
} from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";

const DashboardResumes = () => {
  const [data, setData] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState("resumes");
  const [editTitleId, setEditTitleId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  const userId = useSelector((state) => {
    if (!state.account.user._id) return "";
    return state.account.user._id;
  });

  const user = useSelector((state) => state.account.user);

  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchApi = async () => {
      try {
        if (userId) {
          const response = await axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/v1/resume-builders/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          setData(response.data.data);
        }
      } catch {
        console.log("Error!");
      }
    };
    fetchApi();
  }, [userId, access_token]);

  const handleTitleEditClick = (resumeId, title) => {
    setEditTitleId(resumeId);
    setNewTitle(title);
  };

  const handleTitleChange = (e) => setNewTitle(e.target.value);

  const handleTitleBlur = async (resumeId) => {
    try {
      if (newTitle.trim() !== "") {
        const updatedResume = { title: newTitle };
        await axios.patch(
          `http://localhost:8000/api/v1/resume-builders/${resumeId}`,
          updatedResume,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );
        setData((prevData) =>
          prevData.map((resume) =>
            resume._id === resumeId ? { ...resume, title: newTitle } : resume
          )
        );
      }
    } catch (error) {
      console.error("Error updating title:", error);
    }
    setEditTitleId(null);
  };

  const handleKeyPress = (e, resumeId) => {
    if (e.key === "Enter") {
      handleTitleBlur(resumeId);
    }
  };

  const handleNewResumeClick = async () => {
    const confirmCreate = window.confirm("Bạn có tạo CV mới không?");

    if (confirmCreate) {
      try {
        const newResume = {
          title: "Untitled",
          user: userId,
          personalInformation: {
            name: "",
            email: "",
            address: "",
            phone: "",
            github: "",
            linkedin: "",
          },
          summary: "",
          templateId: "template123",
          experience: [],
          education: [],
          projects: [],
          activities: [],
          awards: [],
          skills: [],
          languages: [],
          interests: [],
          references: [],
          certifications: [],
          customFields: [],
        };

        if (userId) {
          const response = await axios.post(
            "http://localhost:8000/api/v1/resume-builders",
            newResume,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          setData((prevData) => [...prevData, response.data.data]);
          navigate(`edit/${response?.data?.data._id}`);
        } else {
          navigate(`edit/${newResume._id}`);
        }
      } catch (error) {
        console.error("Lỗi khi tạo CV!");
        alert("Có lỗi xảy ra khi tạo CV.");
      }
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

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa CV này không?");
    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:8000/api/v1/resume-builders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setData((prevData) => prevData.filter((resume) => resume._id !== id));
        alert("CV đã được xóa thành công.");
      } catch (error) {
        console.error("Lỗi khi xóa CV:", error);
        alert("Có lỗi xảy ra khi xóa CV.");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/6 p-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto z-100">
        <div className="flex justify-between items-center">
          <img
            className="w-12 h-12 object-contain border-2 rounded-full font-12"
            // src="https://tse2.mm.bing.net/th?id=OIP.xv5ky4lYh1TkiIZW6wwYJAAAAA&pid=Api&P=0&h=180"
            src={
              user?.image ||
              "https://tse2.mm.bing.net/th?id=OIP.xv5ky4lYh1TkiIZW6wwYJAAAAA&pid=Api&P=0&h=180"
            }
            alt="Ảnh đại diện"
          />
          <div className="text-center">
            <h2 className="font-bold">{user.name}</h2>
            <h3 className="text-gray-500">Set your target role</h3>
          </div>
        </div>
        <div className="mt-8">
          <ul className="text-gray-600 font-medium">
            <li
              className={`flex items-center p-2 text-left w-full hover:rounded-md hover:bg-blue-100 hover:text-blue-600 cursor-pointer ${
                activeMenuItem === "dashboard" ? "rounded-md bg-blue-100" : ""
              }`}
              onClick={() => handleMenuClick("dashboard", "/dashboard")}
            >
              <MdDashboard className="mr-4 text-xl" /> Dashboard
            </li>
            <li
              className={`flex items-center p-2 text-left w-full hover:rounded-md hover:bg-blue-100 hover:text-blue-600 cursor-pointer ${
                activeMenuItem === "resumes"
                  ? "rounded-md bg-blue-100 text-blue-600"
                  : ""
              }`}
              onClick={() => handleMenuClick("resumes", "/resumes")}
            >
              <IoDocumentTextOutline className="mr-4 text-xl" />
              My Resumes
            </li>
            <li
              className={`flex items-center p-2 text-left w-full hover:rounded-md hover:bg-blue-100 hover:text-blue-600 cursor-pointer ${
                activeMenuItem === "recommended"
                  ? "rounded-md bg-blue-100 text-blue-600"
                  : ""
              }`}
              onClick={() => handleMenuClick("recommended", "/recommended")}
            >
              <MdOutlineFindInPage className="mr-4 text-xl" /> Recommended Jobs
            </li>
            <li
              className={`flex items-center p-2 text-left w-full hover:rounded-md hover:bg-blue-100 hover:text-blue-600 cursor-pointer ${
                activeMenuItem === "dashboard"
                  ? "rounded-md bg-blue-100 text-blue-600"
                  : ""
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
          <div>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg mr-2">
              Upload Resume
            </button>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
              onClick={handleNewResumeClick}
            >
              + Create New
            </button>
          </div>
        </div>

        <div className="rounded-lg grid grid-cols-2 gap-4">
          {data.length > 0 ? (
            data.map((resume) => (
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
                      resume?.imageResume ||
                      "https://th.bing.com/th/id/OIP.wzvz7KNJz_DYS_M6MibRXAAAAA?rs=1&pid=ImgDetMain"
                    }
                    alt="Resume"
                    className="w-44 h-60 object-cover border-2 rounded-md"
                  />
                </div>
                <div className="flex-1 pl-4">
                  <div className="flex justify-content items-center">
                    {editTitleId === resume._id ? (
                      <input
                        type="text"
                        value={newTitle}
                        onChange={handleTitleChange}
                        onBlur={() => handleTitleBlur(resume._id)}
                        onKeyPress={(e) => handleKeyPress(e, resume._id)}
                        className="outline-none text-xl font-bold border-blue-300 border-b-2"
                        autoFocus
                      />
                    ) : (
                      <h2
                        className="text-xl font-bold hover:text-blue-600 mr-2"
                        onClick={() => handleResumeClick(resume._id)}
                      >
                        {resume.title}
                      </h2>
                    )}
                    <MdDriveFileRenameOutline
                      className="hover:text-blue-600"
                      size={25}
                      onClick={() =>
                        handleTitleEditClick(resume._id, resume.title)
                      }
                    />
                  </div>
                  <div
                    className="text-gray-500 hover:text-blue-600"
                    onClick={() => handleResumeClick(resume._id)}
                  >
                    Updated{" "}
                    {resume.updatedAt
                      ? new Date(resume.updatedAt).toLocaleString()
                      : "Unknown"}
                  </div>
                  <div className="mt-2 text-green-600 font-medium hover:text-blue-600">
                    {resume.score !== undefined ? resume.score : 100}% Your
                    resume score
                  </div>

                  <div className="mt-4">
                    <button className="text-600 font-medium flex items-center hover:text-blue-600">
                      Tailor to job listing
                      <span className="ml-2 bg-gray-200 text-xs px-2 py-1 rounded-full">
                        NEW
                      </span>
                    </button>
                    <button className="flex items-center block mt-2 text-600 font-medium hover:text-blue-600">
                      <FaRegFilePdf className="mr-2 text-xl" />
                      Download PDF
                    </button>
                    <button
                      className="flex items-center block mt-2 text-600 font-medium hover:text-blue-600"
                      onClick={() => handleDeleteClick(resume._id)}
                    >
                      <RiDeleteBin6Line className="mr-2 text-xl" />
                      Delete
                    </button>
                    <button className="flex items-center block mt-2 text-600 font-medium hover:text-blue-600">
                      <IoIosMore className="mr-2 text-xl" />
                      More
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}

          <div className="w-full flex items-center p-4 cursor-pointer">
            <div
              className="w-44 min-h-60 border border-dashed rounded-lg h-full flex justify-center items-center cursor-pointer"
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

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdDriveFileRenameOutline,
  MdOutlineFindInPage,
} from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { FaLeaf, FaRegFilePdf } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import React from "react";
import "./index.scss";
import UploadResumeModal from "./Upload/UploadResumeModal";
import LookingJobModal from "./Modal/LookingJobModal";
import { notification } from "antd";
import { Modal as AntModal } from "antd";
import { User } from "lucide-react";
// import { image } from "html2canvas/dist/types/css/types/image";

const DashboardResumes = () => {
  const [data, setData] = useState([]);
  // const [template, setTemplate] = useState([]);

  const [activeMenuItem, setActiveMenuItem] = useState("resumes");
  const [editTitleId, setEditTitleId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const user = useSelector((state) => state.account.user);
  const access_token = localStorage.getItem("access_token");
  const isInitialRender = useRef(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  const userId = useSelector((state) => {
    if (!state.account.user._id) return "";
    return state.account.user._id;
  });

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };
  const handleSearch = () => {
    fetchData();
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const handleNewResume = () => {
      handleNewResumeClick();
    };

    if (location.state?.shouldCallHandleNewResumeClick) {
      navigate("/resumes", {
        state: { shouldCallHandleNewResumeClick: false },
      });
      handleNewResume();
    }
  }, [location.state?.shouldCallHandleNewResumeClick]);

  // useEffect(() => {
  //   const fetchApi = async () => {
  //     try {
  //       if (userId) {
  //         const response = await axios.get(
  //           `${
  //             import.meta.env.VITE_BACKEND_URL
  //           }/api/v1/resume-builders/user/${userId}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${access_token}`,
  //             },
  //           }
  //         );

  //         setData(response.data.data.result);
  //       }
  //     } catch {
  //       console.log("Error!");
  //     }
  //   };
  //   fetchApi();
  // }, [userId, access_token]);
  const fetchData = async () => {
    try {
      setIsOpenLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL
        }/api/v1/resume-builders/user/${userId}`,
        {
          params: {
            title: `/${searchQuery}/i`,
            "personalInformation.name": `/${searchQuery}/i`,
            sort: sortOption,
          },
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setData(response.data.data.result);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsOpenLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, sortOption, access_token]);

  // useEffect(() => {
  //   const fetchTemplate = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8000/api/v1/template/${templateId}`
  //       );
  //       setTemplate(response.data.data);
  //     } catch (error) {
  //       console.error("Failed to fetch template:", error);
  //     }
  //   };

  //   fetchTemplate();
  // }, []);
  const handleTitleEditClick = (resumeId, title) => {
    setEditTitleId(resumeId);
    setNewTitle(title);
  };

  const openNotification = (type, message) => {
    notification[type]({
      message: message,
      duration: 3,
      placement: "topRight",
    });
  };

  const handleTitleChange = (e) => setNewTitle(e.target.value);

  const handleTitleBlur = async (resumeId) => {
    // console.log("resumeId: " + resumeId);
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

  const templateId = "674e93b3bfb654c104907060";

  const handleNewResumeClick = async () => {
    AntModal.confirm({
      title: "Do you want to create a new CV?",
      onOk: async () => {
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
              image: "",
            },
            summary: "",
            template: templateId,
            settings: {
              colors: {
                header: [],
                footer: [],
                text: [],
                background: [],
              },
              fonts: {
                primary: [],
                secondary: [],
              },
            },
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
            openNotification("success", "Create new CV successfully!");
            navigate(`edit/${response?.data?.data._id}`);
          } else {
            openNotification("success", "Create new CV successfully!");
            navigate(`edit/${newResume._id}`);
          }
        } catch (error) {
          console.error("Error creating CV!");
          openNotification("error", "Error creating CV!");
        }
      },
      onCancel() { },
    });
  };

  const handleMenuClick = (menuItem, path) => {
    setActiveMenuItem(menuItem);
    navigate(path);
  };

  const handleResumeClick = async (id) => {
    AntModal.confirm({
      title: "Would you like to edit this CV?",
      onOk: async () => {
        navigate(`edit/${id}`);
      },
      onCancel() { },
    });
  };

  const handleDeleteClick = async (id) => {
    AntModal.confirm({
      title: "Do you want to delete this CV?",
      onOk: async () => {
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
          openNotification("success", "CV was deleted successfully!");
        } catch (error) {
          console.error("Error when deleting CV:", error);
          openNotification("error", "Error when deleting CV!");
        }
      },
      onCancel() { },
    });
  };
  const [isOpenLoading, setIsOpenLoading] = useState(false);

  const OpenLoading = () => setIsOpenLoading(true);
  const CloseLoading = () => setIsOpenLoading(false);
  useEffect(() => { }, fileInputRef.current);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    //    console.log("iisss", isHandlingRef)
    OpenLoading();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", String(userId));
    console.log("\t\t\tuserId:\n\t", String(userId));

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/resume-upgrade/upload-resume",

        formData
      );
      console.log("\n\n\nres:", response);

      const uploadData = response.data.data;
      console.log(response);
      console.log(uploadData);
      try {
        if (userId) {
          const response2 = await axios.post(
            "http://localhost:8000/api/v1/resume-builders",
            uploadData,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          setData((prevData) => [...prevData, response2.data.data]);
          //          console.log("iisss", isHandlingRef)

          navigate(`edit/${response2?.data?.data._id}`);
        } else {
        }
      } catch (error) {
        console.log("lỗi: ", error);
        console.log(
          "Lỗi khi tạo CV:",
          error.response ? error.response.data : error.message
        );
        openNotification("error", "Error creating CV!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const [showLookingJobModal, setShowLookingJobModal] = useState(false);

  const handleShowLookingJobModal = () => setShowLookingJobModal(true);
  const handleCloseLookingJobModal = () => setShowLookingJobModal(false);

  return (
    <>
      <div className="flex min-h-screen">
        <div className="w-1/6 p-6 sticky top-14 h-[calc(100vh-3.5rem)] ">
          {/* overflow-y-auto z-100 */}
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
                className={`flex items-center p-2 text-left w-full hover:rounded-md cursor-pointer hover:bg-blue-100 hover:text-blue-600 ${activeMenuItem === "dashboard"
                  ? "rounded-md bg-blue-100 text-blue-600"
                  : ""
                  }`}
                onClick={() => handleMenuClick("dashboard", "/dashboard")}
              >
                <MdDashboard className="mr-4 text-xl" /> Dashboard
              </li>
              <li
                className={`flex items-center p-2 text-left w-full hover:rounded-md cursor-pointer hover:bg-blue-100 hover:text-blue-600 ${activeMenuItem === "resumes"
                  ? "rounded-md bg-blue-100 text-blue-600"
                  : ""
                  }`}
                onClick={() => handleMenuClick("resumes", "/resumes")}
              >
                <IoDocumentTextOutline className="mr-4 text-xl" />
                My Resumes
              </li>
              <li
                className={`flex items-center p-2 text-left w-full hover:rounded-md cursor-pointer hover:bg-blue-100  hover:text-blue-600 ${activeMenuItem === "recommendedJob"
                  ? "rounded-md bg-blue-100 text-blue-600"
                  : ""
                  }`}
                onClick={() =>
                  handleMenuClick("recommendedJob", "/recommendedJob")
                }
              >
                <MdOutlineFindInPage className="mr-4 text-xl" /> Recommended
                Jobs
              </li>
              <li
                className={`flex items-center p-2 text-left w-full hover:rounded-md cursor-pointer hover:bg-blue-100  hover:text-blue-600 ${activeMenuItem === "dashboard"
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
            <div className="d-flex">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-lg mr-2 custom-button"
                onClick={handleShowLookingJobModal}
              >
                Turn on job search
              </button>
              <LookingJobModal
                show={showLookingJobModal}
                data={data}
                handleClose={handleCloseLookingJobModal}
                user={user}
              />

              <button
                onClick={openModal}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg mr-2 custom-button"
              >
                Upload Resume
              </button>
              <UploadResumeModal
                isOpen={isModalOpen}
                onClose={closeModal}
                handleFileChange={handleFileChange}
                handleButtonClick={handleButtonClick}
                fileInputRef={fileInputRef}
                isLoading={isOpenLoading}
                openLoading={OpenLoading}
                closeLoading={CloseLoading}
              />

              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                onClick={handleNewResumeClick}
              >
                + Create New
              </button>
            </div>
          </div>
          <form class="max-w-md mx-auto">
            <label
              for="default-search"
              class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search with name or title"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </form>
          <select onChange={handleSortChange} value={sortOption}>
            <option value="">Default</option>
            <option value="createdAt">Lastest</option>
            <option value="-createdAt">Oldest</option>
            <option value="-updatedAt">Updatest</option>
          </select>
          {isOpenLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="loader"></div>
            </div>
          ) : (
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
                          resume?.template?.previewImage ||
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
                            // onKeyPress={(e) => handleKeyPress(e, resume._id)}
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
                <>
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
                        Create a tailored resume for each job application.
                        Double your chances of getting hired!
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardResumes;

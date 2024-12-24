import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import "./index.scss";
import UploadResumeModal from "./Upload/UploadResumeModal";
import LookingJobModal from "./Modal/LookingJobModal";
import { notification } from "antd";
import { Modal as AntModal } from "antd";

const MyResumes = () => {
  const user = useSelector((state) => state.account.user);
  const userId = useSelector((state) => {
    if (!state.account.user._id) return "";
    return state.account.user._id;
  });
  const access_token = localStorage.getItem("access_token");
  const isInitialRender = useRef(true);

  const [data, setData] = useState([]);
  const [editTitleId, setEditTitleId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showLookingJobModal, setShowLookingJobModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    try {
      setIsOpenLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
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

  const handleTitleEditClick = (resumeId, title) => {
    setEditTitleId(resumeId);
    setNewTitle(title);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };
  const handleSearch = () => {
    fetchData();
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
      onCancel() {},
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
      onCancel() {},
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
      onCancel() {},
    });
  };

  useEffect(() => {}, fileInputRef.current);
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
          //console.log("iisss", isHandlingRef)

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

  const OpenLoading = () => setIsOpenLoading(true);
  const CloseLoading = () => setIsOpenLoading(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleShowLookingJobModal = () => setShowLookingJobModal(true);
  const handleCloseLookingJobModal = () => setShowLookingJobModal(false);

  return (
    <>
      <div className="p-8">
        <div className="ml-6 flex justify-between items-center mb-8">
          <h1 className="text-blue-600 text-3xl font-bold">My Resumes</h1>
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
              className="bg-blue-500 text-white px-6 py-2 rounded-lg mr-2 custom-button"
              onClick={handleNewResumeClick}
            >
              + Create New
            </button>
          </div>
        </div>
        {/* <form class="max-w-md mx-auto">
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
        </form> */}
        <div class="flex rounded-md border-2 border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
          <input
            type="email"
            placeholder="Search Something..."
            class="w-full outline-none bg-white text-gray-600 text-sm px-4 py-3"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="button"
            class="flex items-center justify-center bg-[#007bff] px-5"
            onClick={handleSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              width="16px"
              class="fill-white"
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
          </button>
        </div>
        <select
          className="bg-gray-100"
          onChange={handleSortChange}
          value={sortOption}
        >
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
                      Create a tailored resume for each job application. Double
                      your chances of getting hired!
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MyResumes;

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
import { IoDocumentTextOutline } from "react-icons/io5";
import { DataContext } from "@/context/DataContext";
import ResumePreview from "./EditResume/ResumePreview";

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
            // "personalInformation.name": `/${searchQuery}/i`,
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

        {/* Form Search */}
        <div class="mb-4 flex items-center">
          <div className="w-1/5">
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
          </div>

          <div class="w-1/2 flex items-center">
            <input
              type="search"
              id="default-input-search"
              class="w-full p-2 mr-4 rounded-md border focus:border-none"
              placeholder="Search with name or title"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch();
              }}
            />
            <button
              type="button"
              class="text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg text-sm px-4 py-2"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        {isOpenLoading ? (
          <div className="absolute top-1/2 left-1/2">
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
                      {/* <button className="text-600 font-medium flex items-center hover:text-blue-600">
                        Tailor to job listing
                        <span className="ml-2 bg-gray-200 text-xs px-2 py-1 rounded-full">
                          NEW
                        </span>
                      </button> */}
                      <button
                        className="flex items-center block mt-2 text-600 font-medium hover:text-blue-600"
                        onClick={() =>
                          window.open(`/resumes/view/${resume._id}`, "_blank")
                        }
                      >
                        <IoDocumentTextOutline className="mr-2 text-xl" />
                        View resume details
                      </button>
                      <button
                        className="flex items-center block mt-2 text-600 font-medium hover:text-blue-600"
                        onClick={() =>
                          window.open(`/resumes/view/${resume._id}`, "_blank")
                        }
                      >
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

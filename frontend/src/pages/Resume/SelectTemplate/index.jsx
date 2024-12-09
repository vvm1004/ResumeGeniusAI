import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const TemplateSelector = () => {
  const [templateData, setTemplateData] = useState([]);
  const userId = useSelector((state) => {
    if (!state.account.user._id) return "";
    return state.account.user._id;
  });
  const access_token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/template`
        );
        setTemplateData(response.data.data.result);
      } catch (error) {
        console.error("Error fetching template data!", error);
      }
    };
    fetchTemplate();
  }, []);

  // Hàm cắt bớt mô tả nếu quá dài
  const truncateDescription = (description, length = 100) => {
    if (description.length > length) {
      return description.substring(0, length) + "...";
    }
    return description;
  };
  const handleNewResumeClick = async (id) => {
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
        template: id,
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
        // setData((prevData) => [...prevData, response.data.data]);
        navigate(`/resumes/edit/${response?.data?.data._id}`);
      } else {
        navigate(`/resumes/edit/${newResume._id}`);
      }
    } catch (error) {
      console.error("Error creating CV!");
    }
  };
  console.log(userId);
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Template</h1>

      {/* Hiển thị danh sách template */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {templateData.map((template) => (
          <div
            key={template._id}
            className="bg-white border rounded-lg shadow-lg overflow-hidden flex flex-col"
          >
            {/* Hình ảnh preview của template */}
            <div className="flex justify-center items-center">
              <img
                src={template.previewImage}
                alt={template.name}
                className="w-44 h-60 object-cover rounded-t-lg"
              />
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-gray-800">
                {template.name}
              </h3>
              <p className="text-gray-600 mt-2 mb-4 flex-grow">
                {truncateDescription(template.description, 100)}{" "}
              </p>
              <div className="flex justify-center items-center">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  onClick={() => handleNewResumeClick(template._id)}
                >
                  Choose Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;

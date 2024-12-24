import { useContext, useEffect, useState } from "react";
import AddSection from "./AddSection";
import Education from "./Education";
import EmploymentHistory from "./EmploymentHistory";
import PersonalDetail from "./PersonalDetail";
import Skills from "./Skills";
import ProfessionalSummary from "./ProfessionalSumary";
import Languages from "./Languages";
import Projects from "./Projects";
import Awards from "./Awards";
import References from "./References";
import Certifications from "./Certifications";
import { DataContext } from "@/context/DataContext";
import CustomFields from "./CustomFields";
import axios from "axios";
import { Modal, notification } from "antd";
import { useNavigate } from "react-router-dom";

import imageCompression from "browser-image-compression";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function FormSection() {
  const [sections, setSections] = useState([]);
  const { data, setData, id, access_token } = useContext(DataContext);
  const navigate = useNavigate();

  const openNotification = (type, message) => {
    notification[type]({
      message: message,
      placement: "topRight",
      duration: 2,
    });
  };
  // const generatePDF = () => {
  //   return new Promise((resolve, reject) => {
  //     const element = document.querySelector(".resume-cv");
  //     html2canvas(element, {
  //       scale: 0.5,
  //       useCORS: true,
  //     })
  //       .then((canvas) => {
  //         const imgData = canvas.toDataURL("image/png");
  //         const imgWidth = canvas.width;
  //         const imgHeight = canvas.height;
  //         const doc = new jsPDF({
  //           orientation: imgWidth > imgHeight ? "landscape" : "portrait",
  //           unit: "px",
  //           format: [imgWidth, imgHeight],
  //         });
  //         doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  //         // Trả về đối tượng jsPDF
  //         resolve(doc);
  //       })
  //       .catch((error) => {
  //         console.error("Error in generating PDF", error);
  //         reject(error);
  //       });
  //   });
  // };

  // const createAndUploadPDF = async () => {
  //   try {
  //     const doc = await generatePDF();

  //     const pdfBlob = doc.output("blob");
  //     const formData = new FormData();
  //     formData.append("fileUpload", pdfBlob, `${data._id}.pdf`);

  //     const headers = {
  //       "Content-Type": "multipart/form-data",
  //       folder_type: "url_Resume",
  //       Authorization: `Bearer ${access_token}`,
  //     };

  //     const response = await axios.post(
  //       `http://localhost:8000/api/v1/files/upload-resume/${data._id}`,
  //       formData,
  //       { headers }
  //     );
  //     const urlResume = { urlResume: response.data.data.fileName };
  //     console.log("link url: " + urlResume);
  //     await axios.patch(
  //       `http://localhost:8000/api/v1/resume-builders/${data._id}`,
  //       urlResume,
  //       {
  //         headers: { Authorization: `Bearer ${access_token}` },
  //       }
  //     );

  //     console.log("Response from upload API:", response.data);
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // };
  // const saveResumeAsImage = async () => {
  //   const resumeContent = document.querySelector(".resume-cv");
  //   const canvas = await html2canvas(resumeContent);
  //   const imgData = canvas.toDataURL("image/png");

  //   if (imgData) {
  //     // Chuyển đổi imgData thành Blob để nén
  //     const blob = await fetch(imgData).then((res) => res.blob());

  //     // Tùy chọn nén
  //     const options = {
  //       maxSizeMB: 0.1, // Kích thước tối đa 100KB
  //       maxWidthOrHeight: 800, // Chiều rộng hoặc chiều cao tối đa
  //       useWebWorker: true, // Sử dụng Web Worker để nén nhanh hơn
  //       initialQuality: 0.8,
  //     };

  //     try {
  //       let compressedFile = await imageCompression(blob, options);

  //       // Kiểm tra kích thước và điều chỉnh nếu cần
  //       while (compressedFile.size > 100 * 1024) {
  //         // 100KB
  //         options.initialQuality -= 0.05; // Giảm chất lượng 5%
  //         compressedFile = await imageCompression(blob, options);
  //       }

  //       const compressedImgData = await imageCompression.getDataUrlFromFile(
  //         compressedFile
  //       );
  //       const updatedResume = { imageResume: compressedImgData };
  //       await axios.patch(
  //         `http://localhost:8000/api/v1/resume-builders/${data._id}`,
  //         updatedResume,
  //         {
  //           headers: { Authorization: `Bearer ${access_token}` },
  //         }
  //       );
  //       console.log("Resume updated successfully");
  //     } catch (error) {
  //       console.error("Lỗi lưu hình ảnh:", error);
  //     }
  //   }
  // };
  const handleSave = async () => {
    if (!data?.title || data?.title.trim() === "") {
      openNotification(
        "error",
        "Job Title cannot be empty! Please enter a title."
      );
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (
      !data?.personalInformation?.email ||
      !emailPattern.test(data?.personalInformation?.email)
    ) {
      openNotification("error", "Please enter a valid email address.");
      return;
    }

    Modal.confirm({
      title: "Do you want to save the changes?",
      onOk: async () => {
        if (data && id !== "undefined") {
          // saveResumeAsImage();
          // createAndUploadPDF();
          try {
            await axios.patch(
              `http://localhost:8000/api/v1/resume-builders/${id}`,
              data,
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            );
            openNotification("success", "Profile updated successfully!");
            navigate("/resumes");
          } catch (error) {
            openNotification(
              "error",
              "An error occurred while updating your profile. Please try again."
            );
          }
        } else {
          openNotification("success", "Profile updated successfully!");
          navigate("/resumes");
        }
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    const savedSections = JSON.parse(localStorage.getItem("sections"));
    if (savedSections && savedSections[data._id]) {
      setSections(savedSections[data._id]);
    }
  }, [data._id]);

  const handleAddSection = (section) => {
    const sectionExists = sections.some((sec) => sec.type === section.type);

    if (!sectionExists) {
      const updatedSections = [...sections, { type: section.type }];
      setSections(updatedSections);

      const savedSections = JSON.parse(localStorage.getItem("sections")) || {};
      savedSections[data._id] = updatedSections;
      localStorage.setItem("sections", JSON.stringify(savedSections));
    } else {
      openNotification("error", `${section.type} section already exists!`);
    }
  };

  const handleRemoveSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);

    const savedSections = JSON.parse(localStorage.getItem("sections")) || {};
    savedSections[data._id] = updatedSections;
    localStorage.setItem("sections", JSON.stringify(savedSections));
  };

  const renderSection = (section) => {
    switch (section.type) {
      case "Awards":
        return <Awards />;
      case "References":
        return <References />;
      case "Certifications":
        return <Certifications />;
      case "CustomFields":
        return <CustomFields />;
      default:
        return null;
    }
  };

  const handleBack = () => {
    navigate('/resumes'); 
  };

  return (
    <>
      <div>
        <button
          onClick={handleBack}
          className="bg-blue-500 text-white px-6 py-2 ml-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 12H5m7-7l-7 7 7 7"
            />
          </svg>
          Back
        </button>

        <h2 className="text-center text-3xl font-bold">CV</h2>
        <PersonalDetail />
        <ProfessionalSummary />
        <EmploymentHistory />
        <Education />
        <Projects />
        <Skills />
        <Languages />

        {sections.map((section, index) => (
          <div key={index} className="added-section relative">
            <button
              onClick={() => handleRemoveSection(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              X
            </button>
            {renderSection(section)}
          </div>
        ))}

        <div className="mt-6 text-right mr-10">
          <button
            className="pl-10 pr-10 text-lg text-black bg-blue-500 rounded-sm p-2 font-semibold hover:text-white "
            onClick={handleSave}
          >
            Save
          </button>
        </div>

        <div className="max-w-3xl mx-auto p-8 mt-6 bg-white rounded-lg shadow-md">
          <AddSection onAddSection={handleAddSection} />
        </div>
      </div>
    </>
  );
}

export default FormSection;

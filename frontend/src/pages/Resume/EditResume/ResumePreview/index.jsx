import React, { useContext, useEffect, useState } from "react";
import "../../../../styles/client.module.scss";
import { DataContext } from "../../../../context/DataContext";
import TemplateSelection from "../../TemplateSelection/TemplateSelection";
import { AiFillAppstore } from "react-icons/ai";
import jsPDF from "jspdf";
import { IoIosMore, IoIosMail } from "react-icons/io";
import html2canvas from "html2canvas";
import axios from "axios";
import imageCompression from "browser-image-compression";

import Template1 from "../../Template/Template1";
import Template2 from "../../Template/Template2";
import Template3 from "../../Template/Template3";
import Template4 from "../../Template/Template4";
import Template5 from "../../Template/Template5";
import Template6 from "../../Template/Template6";
import { Descriptions, message, notification } from "antd";

const ResumePreview = () => {
  const { data, setData, access_token } = useContext(DataContext);
  const [template, setTemplate] = useState([]);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  // // const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [imageCV, setImageCV] = useState(null);
  const [loader, setLoader] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleIconClick = () => {
    setShowTemplateSelection(!showTemplateSelection);
  };

  const handleSelectTemplate = async (templateId) => {
    setTemplate(templateId);
    setShowTemplateSelection(false);
    await updateTemplateId(templateId);
  };
  const handleSendMail = () => {
    try {
      const response = axios.get(
        `http://localhost:8000/api/v1/mail/${data._id}/sendresume`
      );
      if (response) {
        message.success("Gửi Resume qua gmail thành công");
      }
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: error,
      });
    }
  };

  const renderSelectedTemplate = () => {
    switch (template) {
      case "1":
        return <Template1 data={data} />;
      case "2":
        return <Template2 data={data} />;
      case "3":
        return <Template3 data={data} />;
      case "4":
        return <Template4 data={data} />;
      case "5":
        return <Template5 data={data} />;
      case "6":
        return <Template6 data={data} />;
      default:
        return <div>Select a template to preview</div>;
    }
  };

  const exportToPDF = () => {
    const element = document.querySelector(".resume-cv");
    setLoader(true);
    html2canvas(element, {
      scale: 3,
      useCORS: true,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const doc = new jsPDF({
          orientation: imgWidth > imgHeight ? "landscape" : "portrait",
          unit: "px",
          format: [imgWidth, imgHeight],
        });
        doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        setLoader(false);
        doc.save("download.pdf");
      })
      .catch((error) => {
        console.error("Error in generating PDF", error);
        setLoader(false);
      });
  };

  useEffect(() => {
    const saveResumeAsImage = async () => {
      const resumeContent = document.querySelector(".resume-cv");
      const canvas = await html2canvas(resumeContent);
      const imgData = canvas.toDataURL("image/png");

      if (imgData) {
        // Chuyển đổi imgData thành Blob để nén
        const blob = await fetch(imgData).then((res) => res.blob());

        // Tùy chọn nén
        const options = {
          maxSizeMB: 0.1, // Kích thước tối đa 100KB
          maxWidthOrHeight: 800, // Chiều rộng hoặc chiều cao tối đa
          useWebWorker: true, // Sử dụng Web Worker để nén nhanh hơn
          initialQuality: 0.8,
        };

        try {
          let compressedFile = await imageCompression(blob, options);

          // Kiểm tra kích thước và điều chỉnh nếu cần
          while (compressedFile.size > 100 * 1024) {
            // 100KB
            options.initialQuality -= 0.05; // Giảm chất lượng 5%
            compressedFile = await imageCompression(blob, options);
          }

          const compressedImgData = await imageCompression.getDataUrlFromFile(
            compressedFile
          );
          setImageCV(compressedImgData); // Cập nhật hình ảnh đã nén
        } catch (error) {
          console.error("Lỗi nén hình ảnh:", error);
        }
      }
    };

    const saveImageAndUpdateResume = async () => {
      await saveResumeAsImage();
    };

    saveImageAndUpdateResume();
  }, [data]);

  useEffect(() => {
    const updateResume = async () => {
      console.log("data_id:" + data._id);
      if (imageCV && data._id) {
        // Kiểm tra cả imageCV và data._id
        try {
          const updatedResume = { imageResume: imageCV };
          const response = await axios.patch(
            `http://localhost:8000/api/v1/resume-builders/${data._id}`,
            updatedResume,
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );
        } catch (error) {
          console.error("Lỗi cập nhật resume:", error);
        }
      } else {
        console.warn("imageCV hoặc data._id không hợp lệ");
      }
    };

    updateResume();
  }, [imageCV]);

  //Update Template Id
  const updateTemplateId = async (templateId) => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/template");
      const templates = response.data.data.result;
      const selectedTemplate = templates.find(
        (template) => template.id === templateId
      );

      if (selectedTemplate) {
        const updatedData = { template: selectedTemplate._id };
        await axios.patch(
          `http://localhost:8000/api/v1/resume-builders/${data._id}`,
          updatedData,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        setData((prevData) => ({
          ...prevData,
          template: selectedTemplate._id,
        }));
      } else {
        console.error("Template not found.");
      }
    } catch (error) {
      console.error("Error updating template ID:", error);
    }
  };
  //lấy template id từ database
  useEffect(() => {
    const fetchTemplate = async () => {
      if (data?.template?._id) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/v1/template/${data?.template?._id}`
          );
          setTemplate(response.data.data.id);
        } catch (error) {
          console.error("Failed to fetch template:", error);
        }
      }
    };

    fetchTemplate();
  }, [data?.template?._id]);

  return (
    <div>
      <div className="w-full h-full flex justify-center items-center cursor-pointer text-white p-2">
        <div
          className="flex justify-center items-center"
          onClick={handleIconClick}
        >
          <AiFillAppstore className="text-2xl mr-2" />
          Select Template
        </div>
        <span className="ml-2 mr-2">|</span>
        <button
          className="bg-blue-500 rounded-sm p-2 font-semibold mr-1"
          onClick={exportToPDF}
          disabled={!(loader === false)}
        >
          {loader ? <span>Downloading...</span> : <span>Download PDF</span>}
        </button>
        <button
          className="bg-blue-500 rounded-sm p-2 font-semibold"
          onClick={handleDropdownClick}
        >
          <IoIosMore className="text-2xl" />
          {showDropdown && (
            <div className="absolute mt-2 w-52 bg-white shadow-lg rounded-md z-10">
              <button
                className="flex block py-2 ml-2 text-gray-800 hover:bg-gray-200"
                onClick={handleSendMail}
              >
                <IoIosMail size={20} />
                Send To Mail
              </button>
            </div>
          )}
        </button>
      </div>
      <div className="scroll-snap-y h-screen">
        {showTemplateSelection ? (
          <TemplateSelection onSelectTemplate={handleSelectTemplate} />
        ) : (
          <div className="relative w-full h-full flex justify-center items-center mt-2">
            <div
              className="resume-cv w-[210mm] h-[297mm] absolute top-0 rounded-xl 
          left-center bg-white shadow-lg transform scale-50 -translate-y-1/4"
            >
              {renderSelectedTemplate()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;

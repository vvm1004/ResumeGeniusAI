import React, { useContext, useEffect, useState } from "react";
import "../../../../styles/client.module.scss";
import { DataContext } from "../../../../context/DataContext";
import TemplateSelection from "../../TemplateSelection/TemplateSelection";
import { AiFillAppstore } from "react-icons/ai";
import jsPDF from "jspdf";
import { IoIosMore } from "react-icons/io";
import html2canvas from "html2canvas";
import axios from "axios";

import Template1 from "../../Template/Template1";
import Template2 from "../../Template/Template2";
import Template3 from "../../Template/Template3";
import Template4 from "../../Template/Template4";
import Template5 from "../../Template/Template5";
import Template6 from "../../Template/Template6";

const ResumePreview = () => {
  const { data, setData } = useContext(DataContext);

  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  // const [selectedTemplateId, setSelectedTemplateId] = useState(null); // State for selected template
  const [imageCV, setImageCV] = useState(null);
  const access_token = localStorage.getItem("access_token");
  const [loader, setLoader] = useState(false);// thêm loader để tạo hiệu ứng khi export pdf


  const handleIconClick = () => {
    setShowTemplateSelection(!showTemplateSelection);
  };

  const handleSelectTemplate = async (templateId) => {
    // setSelectedTemplateId(templateId);
    setShowTemplateSelection(false);
    await updateTemplateId(templateId);
  };

  const renderSelectedTemplate = () => {
    switch (data?.templateId) {
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
      useCORS: true
    }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const doc = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });
      doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      setLoader(false);
      doc.save('download.pdf');
    }).catch(error => {
      console.error("Error in generating PDF", error);
      setLoader(false);
    });
  };

  const saveResumeAsImage = async () => {
    const resumeContent = document.querySelector(".resume-cv");
    const canvas = await html2canvas(resumeContent);
    const imgData = canvas.toDataURL("image/png");

    if (imgData) {
      setImageCV(imgData);
    }
  };

  useEffect(() => {
    const saveImageAndUpdateResume = async () => {
      await saveResumeAsImage();
    };

    saveImageAndUpdateResume();
  }, [data]);

  useEffect(() => {
    const updateResume = async () => {
      if (imageCV) {
        try {
          const updatedResume = { imageResume: imageCV };
          const response = await axios.patch(
            `http://localhost:8000/api/v1/resume-builders/${data._id}`,
            updatedResume,
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );
          setData((prevData) => ({
            ...prevData,
            imageResume: imageCV,
          }));
        } catch (error) {
          console.error("Lỗi cập nhật resume:", error);
        }
      }
    };

    updateResume();
  }, [imageCV]);

  //Update Template Id

  const updateTemplateId = async (templateId) => {
    try {
      const updatedData = { templateId };

      await axios.patch(
        `http://localhost:8000/api/v1/resume-builders/${data._id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      setData((prevData) => ({
        ...prevData,
        templateId,
      }));
    } catch (error) {
      console.error("Error updating template ID:", error);
    }
  };
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
          {loader ? (
            <span>Downloading...</span>
          ) : (
            <span>Download PDF</span>
          )
          }
        </button>
        <button className="bg-blue-500 rounded-sm p-2 font-semibold">
          <IoIosMore className="text-2xl" />
        </button>
      </div>

      {showTemplateSelection ? (
        <TemplateSelection onSelectTemplate={handleSelectTemplate} />
      ) : (
        <div className="relative w-full h-full flex justify-center items-center mt-2">
          <div
            className="resume-cv w-[210mm] h-[297mm] absolute top-0 rounded-xl overflow-hidden
               left-center bg-white shadow-lg transform scale-50 -translate-y-1/4"
          >
            {renderSelectedTemplate()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;

import React, { useContext, useEffect, useState } from "react";
import "../../../../styles/client.module.scss";
import { DataContext } from "../../../../context/DataContext";
import TemplateSelection from "../../TemplateSelection/TemplateSelection";
import { AiFillAppstore } from "react-icons/ai";
import jsPDF from "jspdf";
import { IoIosMore } from "react-icons/io";
import Template1 from "../../Template/Template1";
import Template2 from "../../Template/Template2";
import Template3 from "../../Template/Template3";
import html2canvas from "html2canvas";
import axios from "axios";

const ResumePreview = () => {
  const { data, setData, access_token } = useContext(DataContext);

  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(3);
  const [imageCV, setImageCV] = useState(null);

  const handleIconClick = () => {
    setShowTemplateSelection(!showTemplateSelection);
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    setShowTemplateSelection(false);
  };

  const renderSelectedTemplate = () => {
    switch (selectedTemplateId) {
      case 1:
        return <Template1 data={data} />;
      case 2:
        return <Template2 data={data} />;
      case 3:
        return <Template3 data={data} />;
      default:
        return <div>Select a template to preview</div>;
    }
  };

  const exportToPDF = () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });

    const resumeContent = document.querySelector(".resume-cv");

    pdf.html(resumeContent, {
      callback: (doc) => {
        doc.save("resume.pdf");
      },
      x: 0,
      y: 10,
      width: pdf.internal.pageSize.getWidth(),
      windowWidth: resumeContent.clientWidth,
    });
  };

  useEffect(() => {
    const saveResumeAsImage = async () => {
      const resumeContent = document.querySelector(".resume-cv");
      const canvas = await html2canvas(resumeContent);
      const imgData = canvas.toDataURL("image/png");

      if (imgData) {
        setImageCV(imgData);
      }
    };

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
        >
          Download PDF
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

// import React, { useContext } from "react";
// import "../../../styles/client.module.scss";
// import PersonalDetailPreview from "./PersonalDetailPreview";
// import ProfessionalSummaryPreview from "./ProfessionSumaryPreview";
// import EmploymentHistoryPreview from "./EmployeeHistoryPreview";
// import EducationPreview from "./EducationPreview";
// import WebsitesAndSocialLinksPreview from "./WebsitesAndSocialLinksPreview";
// import SkillsPreview from "./SkillsPreview";
// import { DataContext } from "../../../context/DataContext";
// import Template from "../SelectTemplate/Template";
// import { AiFillAppstore } from "react-icons/ai";

// const ResumePreview = () => {
//   const { data } = useContext(DataContext);
//   //   return (
//   //     <div className="flex justify-center items-center h-screen">
//   //       <div className="resume-container w-full h-[150%] transform scale-[0.6] origin-top-bottom bg-white shadow-lg p-6">
//   //         <PersonalDetailPreview />
//   //         <ProfessionalSummaryPreview />
//   //         <EmploymentHistoryPreview />
//   //         <EducationPreview />
//   //         <WebsitesAndSocialLinksPreview />
//   //         <SkillsPreview />
//   //       </div>
//   //     </div>
//   //   );
//   // };
//   return (
//     <div>
//       <AiFillAppstore size={30} />
//       <div className="flex justify-center items-center h-screen">

//         <div className="resume-container w-full h-[150%] transform scale-[0.6] origin-top-bottom p-6">

//           <Template data={data} />
//         </div>
//       </div>
//     </div>

//   );
// };

import React, { useContext, useState } from "react";
import "../../../styles/client.module.scss";
import { DataContext } from "../../../context/DataContext";
import TemplateSelection from "../TemplateSelection/TemplateSelection";
import { AiFillAppstore } from "react-icons/ai";
import { FaFileExport } from "react-icons/fa6";
import jsPDF from "jspdf";

// Import tất cả templates
import Template1 from "../Template/Template1";
import Template2 from "../Template/Template2";

const ResumePreview = () => {
  const { data } = useContext(DataContext);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(1); // State for selected template

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

    const resumeContent = document.querySelector(".resume-container");

    // Use the html method to convert the content
    pdf.html(resumeContent, {
      callback: (doc) => {
        doc.save("resume.pdf");
      },
      x: 0, // No left margin
      y: 0, // No top margin
      width: pdf.internal.pageSize.getWidth(), // Full width
      windowWidth: resumeContent.clientWidth, // Full width of the content
    });
  };

  return (
    <div>
      <AiFillAppstore
        size={30}
        onClick={handleIconClick}
        className="cursor-pointer"
      />
      <FaFileExport
        size={30}
        className="cursor-pointer"
        onClick={exportToPDF} // Add onClick handler to export
      />

      {showTemplateSelection ? (
        <TemplateSelection onSelectTemplate={handleSelectTemplate} />
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="resume-container w-full h-[150%] transform scale-[0.6] origin-top-bottom p-6">
            {renderSelectedTemplate()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;

import React from "react";
import "../../../styles/client.module.scss";      
import PersonalDetailPreview from "./PersonalDetailPreview";
import ProfessionalSummaryPreview from "./ProfessionSumaryPreview";
import EmploymentHistoryPreview from "./EmployeeHistoryPreview";
import EducationPreview from "./EducationPreview";
import WebsitesAndSocialLinksPreview from "./WebsitesAndSocialLinksPreview";
import SkillsPreview from "./SkillsPreview";

const ResumePreview = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="resume-container w-full h-[150%] transform scale-[0.6] origin-top-bottom bg-white shadow-lg p-6">
        <PersonalDetailPreview />
        <ProfessionalSummaryPreview />
        <EmploymentHistoryPreview />
        <EducationPreview />
        <WebsitesAndSocialLinksPreview />
        <SkillsPreview />
      </div>
    </div>
  );
};

export default ResumePreview;

import { useState } from "react";
import AddSection from "./AddSection";
import Education from "./Education";
import EmploymentHistory from "./EmploymentHistory";
import PersonalDetail from "./PersonalDetail";
import Skills from "./Skills";
import WebsitesAndSocialLinks from "./WebsitesAndSocialLinks";
import ProfessionalSummary from "./ProfessionalSumary";

function FormSection() {
  const [sections, setSections] = useState([]);

  const handleAddSection = (section) => {
    setSections([...sections, section]);
  };

  return (
    <>
      <div>
        <h2 className='text-center text-3xl font-bold'>CV</h2>
        <PersonalDetail />
        <ProfessionalSummary />
        <EmploymentHistory />
        <Education />
        <WebsitesAndSocialLinks />
        <Skills />

        {sections.map((section, index) => {
          return (
            <div key={index} className="added-section">
              {section}
            </div>
          );
        })}

        <AddSection onAddSection={handleAddSection} />
      </div>
    </>
  );
}

export default FormSection;

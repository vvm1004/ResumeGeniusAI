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

function FormSection(props) {
  const [sections, setSections] = useState([]);
  const { data, setData } = useContext(DataContext);
  const { id, access_token } = props;

  const handleSave = async () => {
    const confirmSave = window.confirm("Do you want to save the changes?");

    if (confirmSave) {
      if (data && id !== "undefined") {
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
          alert("Resume updated successfully!");
        } catch (error) {
          console.error("Error updating resume!", error);
          alert("There was an error updating your resume. Please try again.");
        }
      }
    }
  };

  useEffect(() => {
    // Load sections từ localStorage và kiểm tra với data._id
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

      // Lưu sections cùng với data._id vào localStorage
      const savedSections = JSON.parse(localStorage.getItem("sections")) || {};
      savedSections[data._id] = updatedSections;
      localStorage.setItem("sections", JSON.stringify(savedSections));
    } else {
      alert(`${section.type} section already exists!`);
    }
  };

  const handleRemoveSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);

    // Cập nhật localStorage sau khi xóa section
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

  return (
    <>
      <div>
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

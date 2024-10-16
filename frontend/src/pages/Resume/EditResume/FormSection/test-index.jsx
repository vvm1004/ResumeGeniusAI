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

function FormSection() {
  const { data } = useContext(DataContext);

  // Các section mặc định
  const defaultSections = [
    { type: "PersonalDetail" },
    { type: "ProfessionalSummary" },
    { type: "EmploymentHistory" },
    { type: "Education" },
    { type: "Projects" },
    { type: "Skills" },
    { type: "Languages" },
  ];

  const [sections, setSections] = useState(defaultSections);

  useEffect(() => {
    // Load sections từ localStorage và kiểm tra với data._id
    const savedSections = JSON.parse(localStorage.getItem("sections"));
    if (savedSections && savedSections[data._id]) {
      setSections([...defaultSections, ...savedSections[data._id]]);
    }
  }, [data._id]);

  const handleAddSection = (section) => {
    const sectionExists = sections.some((sec) => sec.type === section.type);

    if (!sectionExists) {
      const updatedSections = [...sections, { type: section.type }];
      setSections(updatedSections);

      // Lưu chỉ những section bổ sung cùng với data._id vào localStorage
      const extraSections = updatedSections.filter(
        (sec) => !defaultSections.some((defSec) => defSec.type === sec.type)
      );
      const savedSections = JSON.parse(localStorage.getItem("sections")) || {};
      savedSections[data._id] = extraSections;
      localStorage.setItem("sections", JSON.stringify(savedSections));
    } else {
      alert(`${section.type} section already exists!`);
    }
  };

  const handleRemoveSection = (index) => {
    const sectionToRemove = sections[index];

    // Chỉ cho phép xóa các section bổ sung, không được xóa defaultSections
    if (defaultSections.some((defSec) => defSec.type === sectionToRemove.type)) {
      alert("Cannot remove default sections.");
      return;
    }

    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);

    // Cập nhật localStorage sau khi xóa section
    const extraSections = updatedSections.filter(
      (sec) => !defaultSections.some((defSec) => defSec.type === sec.type)
    );
    const savedSections = JSON.parse(localStorage.getItem("sections")) || {};
    savedSections[data._id] = extraSections;
    localStorage.setItem("sections", JSON.stringify(savedSections));
  };

  const handleMoveSection = (index, direction) => {
    const newSections = [...sections];

    // Xử lý di chuyển section lên hoặc xuống
    if (direction === "up" && index > 0) {
      [newSections[index], newSections[index - 1]] = [
        newSections[index - 1],
        newSections[index],
      ];
    } else if (direction === "down" && index < newSections.length - 1) {
      [newSections[index], newSections[index + 1]] = [
        newSections[index + 1],
        newSections[index],
      ];
    }

    setSections(newSections);

    // Lưu lại các sections đã được di chuyển (ngoại trừ defaultSections)
    const extraSections = newSections.filter(
      (sec) => !defaultSections.some((defSec) => defSec.type === sec.type)
    );
    const savedSections = JSON.parse(localStorage.getItem("sections")) || {};
    savedSections[data._id] = extraSections;
    localStorage.setItem("sections", JSON.stringify(savedSections));
  };

  const renderSection = (section) => {
    switch (section.type) {
      case "PersonalDetail":
        return <PersonalDetail />;
      case "ProfessionalSummary":
        return <ProfessionalSummary />;
      case "EmploymentHistory":
        return <EmploymentHistory />;
      case "Education":
        return <Education />;
      case "Projects":
        return <Projects />;
      case "Skills":
        return <Skills />;
      case "Languages":
        return <Languages />;
      case "Awards":
        return <Awards />;
      case "References":
        return <References />;
      case "Certifications":
        return <Certifications />;
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <h2 className="text-center text-3xl font-bold">CV</h2>

        {sections.map((section, index) => (
          <div key={index} className="added-section relative group">
            {/* Nút xóa section */}
            {!defaultSections.some((defSec) => defSec.type === section.type) && (
              <button
                onClick={() => handleRemoveSection(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                X
              </button>
            )}

            {/* Nút di chuyển */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {index > 0 && (
                <button
                  onClick={() => handleMoveSection(index, "up")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ↑
                </button>
              )}
              {index < sections.length - 1 && (
                <button
                  onClick={() => handleMoveSection(index, "down")}
                  className="text-blue-500 hover:text-blue-700 ml-2"
                >
                  ↓
                </button>
              )}
            </div>

            {/* Render nội dung section */}
            {renderSection(section)}
          </div>
        ))}

        <div className="max-w-3xl mx-auto p-8 mt-6 bg-white rounded-lg shadow-md">
          <AddSection onAddSection={handleAddSection} />
        </div>
      </div>
    </>
  );
}

export default FormSection;

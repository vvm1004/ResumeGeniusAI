import CustomSection from "./CustomSection";
import Courses from "./Courses";
import ExtraCurricularActivities from "./ExtraCurricularActivities";

function AddSection({ onAddSection }) {
  const handleButtonClick = (sectionName) => {
    switch (sectionName) {
      case "Custom Section":
        onAddSection(<CustomSection />);
        break;
      case "Courses":
        onAddSection(<Courses />);
        break;
      case "Extra-curricular Activities":
        onAddSection(<ExtraCurricularActivities />);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div>
        <h2 className="font-bold mb-4 gap-6">Add Section</h2>
        <div className="grid grid-cols-2">
          <button
            className="btn btn-primary text-left  ml-4 mb-2"
            onClick={() => handleButtonClick("Custom Section")}
          >
            Custom Section
          </button>
          <button
            className="btn btn-primary text-left ml-4 mb-2"
            onClick={() => handleButtonClick("Courses")}
          >
            Courses
          </button>
          <button
            className="btn btn-primary text-left ml-4 mb-2"
            onClick={() => handleButtonClick("Extra-curricular Activities")}
          >
            Extra-curricular Activities
          </button>
        </div>
      </div>
    </>
  );
}

export default AddSection;

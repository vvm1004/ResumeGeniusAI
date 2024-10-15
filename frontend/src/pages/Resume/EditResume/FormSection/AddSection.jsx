import { LucideSettings2 } from "lucide-react";
import { FaAward } from "react-icons/fa";
import { TbCertificate } from "react-icons/tb";
import { RxThickArrowRight } from "react-icons/rx";
import Awards from "./Awards";
import References from "./References";
import Certifications from "./Certifications";

function AddSection({ onAddSection }) {
  const handleButtonClick = (sectionName) => {
    switch (sectionName) {
      case "Awards":
        onAddSection({ type: "Awards" });
        break;
      case "References":
        onAddSection({ type: "References" });
        break;
      case "Certifications":
        onAddSection({ type: "Certifications" });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div>
        <h1 className="text-xl font-semibold mb-2">Add Section</h1>
        <div className="grid grid-cols-2">
          <button
            className="flex items-center btn text-lg"
            onClick={() => handleButtonClick("Custom Section")}
          >
            <span>
              <LucideSettings2 className="text-blue-600 mr-2" size={30} />
            </span>
            Custom Section
          </button>
          <button
            className="flex items-center btn text-lg"
            onClick={() => handleButtonClick("Awards")}
          >
            <span>
              <FaAward className="text-blue-600 mr-2" size={30} />
            </span>
            Awards
          </button>
          <button
            className="flex items-center btn text-lg"
            onClick={() => handleButtonClick("References")}
          >
            <RxThickArrowRight className="text-blue-600 mr-2" size={30} />
            References
          </button>
          <button
            className="flex items-center btn text-lg"
            onClick={() => handleButtonClick("Certifications")}
          >
            <TbCertificate className="text-blue-600 mr-2" size={30} />
            Certifications
          </button>
        </div>
      </div>
    </>
  );
}

export default AddSection;

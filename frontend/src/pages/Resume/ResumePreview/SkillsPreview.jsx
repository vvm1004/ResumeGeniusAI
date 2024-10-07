import { useContext } from "react";
import { DataContext } from "../../../context/DataContext";

function SkillsPreview() {
  const { data } = useContext(DataContext);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Skills</h2>

      {data?.skills && data.skills.length > 0 ? (
        data.skills.map((item, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-bold">
              {item.name || "(No specified skill)"} - {getLevelLabel(item.rating)}
            </h3>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No skills available.</p>
      )}
    </div>
  );
}

const getLevelLabel = (rating) => {
  switch (rating) {
    case 1: return "Novice";
    case 2: return "Beginner";
    case 3: return "Skillful";
    case 4: return "Experienced";
    case 5: return "Expert";
    default: return "Unknown";
  }
};

export default SkillsPreview;

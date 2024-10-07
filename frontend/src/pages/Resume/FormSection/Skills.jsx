import { useContext } from "react";
import { DataContext } from "../../../context/DataContext";

function Skills() {
  const { data, setData } = useContext(DataContext);

  const handleUpdateSkill = (index, updatedField) => {
    const updatedSkills = (data.skills || []).map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, skills: updatedSkills });
  };

  const toggleSkill = (index) => {
    handleUpdateSkill(index, { isOpen: !data.skills[index].isOpen });
  };

  const addSkill = () => {
    const newSkill = {
      name: "",
      rating: 1,
      isOpen: true,
    };
    setData({
      ...data,
      skills: [...(data.skills || []), newSkill],
    });
  };

  const removeSkill = (index) => {
    const updatedSkills = (data.skills || []).filter((_, i) => i !== index);
    setData({ ...data, skills: updatedSkills });
  };

  const getLevelLabel = (rating) => {
    switch (rating) {
      case 1:
        return "Novice";
      case 2:
        return "Beginner";
      case 3:
        return "Skillful";
      case 4:
        return "Experienced";
      case 5:
        return "Expert";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2">Skills</h2>
        <p className="text-sm text-gray-500 mb-4">
          Choose up to 5 important skills that show you fit the position. Make
          sure they match the key skills mentioned in the job listing.
        </p>
      </div>

      {data.skills && data.skills.length > 0 ? (
        data.skills.map((item, index) => (
          <div
            key={index}
            className="skill relative max-w-4xl mx-auto p-6 pt-0 bg-white rounded-lg shadow-md mt-6 group"
          >
            <button
              onClick={() => removeSkill(index)}
              className="absolute top-4 right-4 text-red-500 hidden group-hover:block"
            >
              X
            </button>

            <div
              onClick={() => toggleSkill(index)}
              className="cursor-pointer mb-4"
            >
              <h3 className="text-lg font-semibold">
                {item.name || "(No specified skill)"}{" "}
              </h3>
              <p className="text-gray-500">
                Level - {getLevelLabel(item.rating)}
              </p>
            </div>

            {item.isOpen && (
              <div className="flex items-center gap-4">
                {/* Skill Name */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item.name}
                    onChange={(e) =>
                      handleUpdateSkill(index, { name: e.target.value })
                    }
                  />
                </div>

                {/* Level */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Level - {getLevelLabel(item.rating)}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={item.rating}
                    onChange={(e) =>
                      handleUpdateSkill(index, {
                        rating: parseInt(e.target.value),
                      })
                    }
                    className="flex items-center w-full"
                    />
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No skills added yet.</p>
      )}

      <div className="max-w-4xl mx-auto p-6 pb-0 ml-2">
        <button className="text-blue-600 text-sm" onClick={addSkill}>
          + Add one more skill
        </button>
      </div>
    </>
  );
}

export default Skills;

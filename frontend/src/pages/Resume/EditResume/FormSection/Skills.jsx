import { DataContext } from "@/context/DataContext";
import { useContext } from "react";

function Skills() {
  const { data, setData } = useContext(DataContext);

  const handleUpdateSkills = (index, updatedField) => {
    const updatedSkills = (data?.skills || [])?.map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, skills: updatedSkills });
  };

  const toggleSkill = (index) => {
    handleUpdateSkills(index, { isOpen: !data?.skills[index].isOpen });
  };

  const addSkill = () => {
    const newSkill = {
      title: "",
      value: "",
      isOpen: true,
    };
    setData({
      ...data,
      skills: [...(data?.skills || []), newSkill],
    });
  };

  const removeSkill = (index) => {
    const updatedSkills = (data?.skills || []).filter((_, i) => i !== index);
    setData({ ...data, skills: updatedSkills });
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8 mt-6 bg-white rounded-lg shadow-md">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Skills</h2>
          <p className="text-sm text-gray-500 mb-4">
            Choose up to 5 important skills that show you fit the position. Make
            sure they match the key skills mentioned in the job listing.
          </p>
        </div>

        {data?.skills && data?.skills?.length > 0 ? (
          data?.skills.map((item, index) => (
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
                  {item.title || "(No specified skill)"}{" "}
                </h3>
                <div className="text-gray-500">{item.value}</div>
              </div>

              {item.isOpen && (
                <div className="flex items-center gap-4">
                  {/* Title */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item?.title}
                      onChange={(e) =>
                        handleUpdateSkills(index, { title: e.target.value })
                      }
                    />
                  </div>

                  {/* Value */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Skills Name
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={item?.value}
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) =>
                        handleUpdateSkills(index, {
                          value: e.target.value,
                        })
                      }
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
      </div>
    </>
  );
}

export default Skills;

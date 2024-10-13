import { DataContext } from "@/context/DataContext";
import { useContext } from "react";

function Languages() {
  const { data, setData } = useContext(DataContext);

  const handleUpdateLanguages = (index, updatedField) => {
    const updateLanguages = (data.languages || []).map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, languages: updateLanguages });
  };

  const toggleLanguages = (index) => {
    handleUpdateLanguages(index, { isOpen: !data.languages[index].isOpen });
  };

  const addSkill = () => {
    const newSkill = {
      name: "",
      rating: 1,
      isOpen: true,
    };
    setData({
      ...data,
      languages: [...(data.languages || []), newSkill],
    });
  };

  const removeLanguages = (index) => {
    const updateLanguages = (data.languages || []).filter(
      (_, i) => i !== index
    );
    setData({ ...data, languages: updateLanguages });
  };

  const getLevelLabel = (rating) => {
    switch (rating) {
      case 1:
        return "Native";
      case 2:
        return "Fluent";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8 mt-6 bg-white rounded-lg shadow-md">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Languages</h2>
          <p className="text-sm text-gray-500 mb-4">
            Choose up to 5 important skills that show you fit the position. Make
            sure they match the key skills mentioned in the job listing.
          </p>
        </div>

        {data.languages && data.languages.length > 0 ? (
          data.languages.map((item, index) => (
            <div
              key={index}
              className="skill relative max-w-4xl mx-auto p-6 pt-0 bg-white rounded-lg shadow-md mt-6 group"
            >
              <button
                onClick={() => removeLanguages(index)}
                className="absolute top-4 right-4 text-red-500 hidden group-hover:block"
              >
                X
              </button>

              <div
                onClick={() => toggleLanguages(index)}
                className="cursor-pointer mb-4"
              >
                <h3 className="text-lg font-semibold">
                  {item.title || "(No specified skill)"}{" "}
                </h3>
                <p className="text-gray-500">
                  Level - {getLevelLabel(item.level)}
                </p>
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
                        handleUpdateLanguages(index, { name: e.target.value })
                      }
                    />
                  </div>

                  {/* Level */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Level - {getLevelLabel(item.level)}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={item.level}
                      onChange={(e) =>
                        handleUpdateLanguages(index, {
                          level: parseInt(e.target.value),
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
          <p className="text-center text-gray-500">No languages added yet.</p>
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

export default Languages;

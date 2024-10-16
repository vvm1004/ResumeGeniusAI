import { useContext, useEffect } from "react";
import { DataContext } from "@/context/DataContext";

function CustomFields() {
  const { data, setData } = useContext(DataContext);

  const handleUpdateField = (index, updatedField) => {
    const updatedCustomFields = (data?.customFields || [])?.map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, customFields: updatedCustomFields });
  };

  const toggleField = (index) => {
    if (data.customFields && data.customFields[index]) {
      handleUpdateField(index, { isOpen: !data.customFields[index].isOpen });
    }
  };

  const addCustomField = () => {
    const newField = {
      title: "",
      value: "",
      date: "",
      isOpen: true,
    };
    setData({
      ...data,
      customFields: [...(data?.customFields || []), newField],
    });
  };

  const removeField = (index) => {
    setData((prevData) => {
      const updatedCustomFields = (prevData?.customFields || []).filter((_, i) => i !== index);
      return { ...prevData, customFields: updatedCustomFields };
    });
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8 mt-6 bg-white rounded-lg shadow-md">
        <div className="max-w-4xl mx-auto pb-0">
          <h2 className="text-2xl font-bold mb-2">Custom Fields</h2>
          <div className="text-sm text-gray-500 mb-4">
            Add custom fields to showcase other information such as GitHub stars, awards, or any other achievements.
          </div>
        </div>

        {data?.customFields && data?.customFields?.length > 0 ? (
          data?.customFields?.map((item, index) => (
            <div
              key={index}
              className="custom-field relative max-w-4xl mx-auto p-6 pt-0 bg-white rounded-lg shadow-md mt-6 group"
            >
              <button
                onClick={() => removeField(index)}
                className="absolute top-4 right-4 text-red-500 hidden group-hover:block"
              >
                X
              </button>

              <div
                onClick={() => toggleField(index)}
                className="cursor-pointer mb-4"
              >
                <h3 className="text-lg font-semibold">
                  {item?.title || "(No title specified)"}{" "}
                  {item?.value ? `: ${item?.value}` : ""}
                </h3>
                <div className="text-gray-500">{item?.date || ""}</div>
              </div>

              {item.isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Field Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item?.title}
                      onChange={(e) =>
                        handleUpdateField(index, { title: e.target.value })
                      }
                    />
                  </div>

                  {/* Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Value
                    </label>
                    <input
                      type="text"
                      name="value"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item?.value}
                      onChange={(e) =>
                        handleUpdateField(index, { value: e.target.value })
                      }
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="year"
                      name="date"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item?.date}
                      onChange={(e) =>
                        handleUpdateField(index, { date: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No custom fields available.</p>
        )}

        <div className="max-w-4xl mx-auto p-6 pb-0 ml-2">
          <button className="text-blue-600 text-sm" onClick={addCustomField}>
            + Add one more custom field
          </button>
        </div>
      </div>
    </>
  );
}

export default CustomFields;

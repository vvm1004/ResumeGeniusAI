import { useContext } from "react";
import { DataContext } from "@/context/DataContext";

function References() {
  const { data, setData } = useContext(DataContext);

  const handleUpdateReference = (index, updatedField) => {
    const updatedReferences = (data?.references || []).map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, references: updatedReferences });
  };

  const addReference = () => {
    const newReference = {
      name: "",
      position: "",
      organization: "",
      contact: "",
      isOpen: true, // Added isOpen property
    };
    setData({
      ...data,
      references: [...(data?.references || []), newReference],
    });
  };

  const removeReference = (index) => {
    setData((prevData) => {
      const updatedReferences = (prevData?.references || []).filter((_, i) => i !== index);
      return { ...prevData, references: updatedReferences };
    });
  };

  const toggleReference = (index) => {
    if (data.references && data.references[index]) {
      handleUpdateReference(index, { isOpen: !data.references[index].isOpen });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-6 bg-white rounded-lg shadow-md">
      <div className="max-w-4xl mx-auto pb-0">
        <h2 className="text-2xl font-bold mb-2">References</h2>
        <div className="text-sm text-gray-500 mb-4">
          List your references. Include the name, position, organization, and contact information.
        </div>
      </div>

      {data?.references && data?.references.length > 0 ? (
        data.references.map((item, index) => (
          <div
            key={index}
            className="reference-history relative max-w-4xl mx-auto p-6 pt-0 bg-white rounded-lg shadow-md mt-6 group"
          >
            <button
              onClick={() => removeReference(index)}
              className="absolute top-4 right-4 text-red-500 hidden group-hover:block"
            >
              X
            </button>

            <div onClick={() => toggleReference(index)} className="cursor-pointer mb-4">
              <h3 className="text-lg font-semibold">
                {item?.name || "(No reference specified)"}
              </h3>
              <div className="text-gray-500">{item?.contact || ""}</div>

            </div>

            {item.isOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item?.name}
                    onChange={(e) =>
                      handleUpdateReference(index, { name: e.target.value })
                    }
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item?.position}
                    onChange={(e) =>
                      handleUpdateReference(index, { position: e.target.value })
                    }
                  />
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Organization
                  </label>
                  <input
                    type="text"
                    name="organization"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item?.organization}
                    onChange={(e) =>
                      handleUpdateReference(index, { organization: e.target.value })
                    }
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact
                  </label>
                  <input
                    type="email"
                    name="contact"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item?.contact}
                    onChange={(e) =>
                      handleUpdateReference(index, { contact: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No references available.</p>
      )}

      <div className="max-w-4xl mx-auto p-6 pb-0 ml-2">
        <button
          className="text-blue-600 text-sm"
          onClick={addReference}
        >
          + Add one more reference
        </button>
      </div>
    </div>
  );
}

export default References;

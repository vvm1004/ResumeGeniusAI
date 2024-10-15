import { useContext } from "react";
import { DataContext } from "@/context/DataContext";

function Certifications() {
  const { data, setData } = useContext(DataContext);

  const handleUpdateCertification = (index, updatedField) => {
    const updatedCertifications = (data?.certifications || []).map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, certifications: updatedCertifications });
  };

  const addCertification = () => {
    const newCertification = {
      name: "",
      details: "",
      year: "",
      link: "",
      isOpen: true, // Added isOpen property
    };
    setData({
      ...data,
      certifications: [...(data?.certifications || []), newCertification],
    });
  };

  const removeCertification = (index) => {
    setData((prevData) => {
      const updatedCertifications = (prevData?.certifications || []).filter((_, i) => i !== index);
      return { ...prevData, certifications: updatedCertifications };
    });
  };

  const toggleCertification = (index) => {
    if (data.certifications && data.certifications[index]) {
      handleUpdateCertification(index, { isOpen: !data.certifications[index].isOpen });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-6 bg-white rounded-lg shadow-md">
      <div className="max-w-4xl mx-auto pb-0">
        <h2 className="text-2xl font-bold mb-2">Certifications</h2>
        <div className="text-sm text-gray-500 mb-4">
          List your certifications. Include the certification name, details, year, and a link to more information.
        </div>
      </div>

      {data?.certifications && data?.certifications.length > 0 ? (
        data.certifications.map((item, index) => (
          <div
            key={index}
            className="certification-history relative max-w-4xl mx-auto p-6 pt-0 bg-white rounded-lg shadow-md mt-6 group"
          >
            <button
              onClick={() => removeCertification(index)}
              className="absolute top-4 right-4 text-red-500 hidden group-hover:block"
            >
              X
            </button>

            <div onClick={() => toggleCertification(index)} className="cursor-pointer mb-4">
              <h3 className="text-lg font-semibold">
                {item?.name || "(No certification specified)"}
              </h3>
              <div className="text-gray-500">{item?.link || ""}</div>
            </div>

            {item.isOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Certification Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item?.name}
                    onChange={(e) =>
                      handleUpdateCertification(index, { name: e.target.value })
                    }
                  />
                </div>

                {/* Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Details
                  </label>
                  <input
                    type="text"
                    name="details"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item?.details}
                    onChange={(e) =>
                      handleUpdateCertification(index, { details: e.target.value })
                    }
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item?.year}
                    onChange={(e) =>
                      handleUpdateCertification(index, { year: e.target.value })
                    }
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Link
                  </label>
                  <input
                    type="url"
                    name="link"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item?.link}
                    onChange={(e) =>
                      handleUpdateCertification(index, { link: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No certifications available.</p>
      )}

      <div className="max-w-4xl mx-auto p-6 pb-0 ml-2">
        <button
          className="text-blue-600 text-sm"
          onClick={addCertification}
        >
          + Add one more certification
        </button>
      </div>
    </div>
  );
}

export default Certifications;

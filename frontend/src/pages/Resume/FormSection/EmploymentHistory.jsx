import { useContext, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { DataContext } from "../../../context/DataContext";

function formatMonthYear(monthYear) {
  if (!monthYear) return ""; 
  const [year, month] = monthYear.split("-");
  const date = new Date(year, month - 1); 
  const options = { year: "numeric", month: "short" };
  return date.toLocaleDateString("en-US", options); 
}

function EmploymentHistory() {
  const { data, setData } = useContext(DataContext);
  console.log(data.experience);

  const handleUpdateExperience = (index, updatedField) => {
    const updatedExperience = (data.experience || []).map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, experience: updatedExperience });
  };

  const toggleEmploymentHistory = (index) => {
    handleUpdateExperience(index, { isOpen: !data.experience[index].isOpen });
  };

  const addEmploymentHistory = () => {
    const newEmployment = {
      title: "",
      employer: "",
      startDate: "",
      endDate: "",
      city: "",
      description: "",
      isOpen: true,
    };
    setData({
      ...data,
      experience: [...(data.experience || []), newEmployment],
    });
  };

  const removeEmploymentHistory = (index) => {
    const updatedExperience = (data.experience || []).filter((_, i) => i !== index);
    setData({ ...data, experience: updatedExperience });
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2">Employment History</h2>
        <p className="text-sm text-gray-500 mb-4">
          Show your relevant experience (last 10 years). Use bullet points to
          note your achievements, if possible - use numbers/facts (Achieved X,
          measured by Y, by doing Z).
        </p>
      </div>

      {(data.experience && data.experience.length > 0) ? (
        data.experience.map((item, index) => (
          <div
            key={index}
            className="employment-history relative max-w-4xl mx-auto p-6 pt-0 bg-white rounded-lg shadow-md mt-6 group"
          >
            <button
              onClick={() => removeEmploymentHistory(index)}
              className="absolute top-4 right-4 text-red-500 hidden group-hover:block"
            >
              X
            </button>

            <div
              onClick={() => toggleEmploymentHistory(index)}
              className="cursor-pointer mb-4"
            >
              <h3 className="text-lg font-semibold">
                {item.title || "(No specified)"}{" "}
                {item.companyName ? `at ${item.companyName}` : ""}
              </h3>
              <p className="text-gray-500">
                {formatMonthYear(item.startDate)} - {formatMonthYear(item.endDate)}
              </p>
            </div>

            {item.isOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job title
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item.title}
                    onChange={(e) =>
                      handleUpdateExperience(index, { title: e.target.value })
                    }
                  />
                </div>

                {/* Employer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Employer
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item.companyName}
                    onChange={(e) =>
                      handleUpdateExperience(index, {
                        companyName: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Start & End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start & End Date
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="month"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item.startDate}
                      onChange={(e) =>
                        handleUpdateExperience(index, {
                          startDate: e.target.value,
                        })
                      }
                    />
                    <input
                      type="month"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item.endDate}
                      onChange={(e) =>
                        handleUpdateExperience(index, {
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item.city}
                    onChange={(e) =>
                      handleUpdateExperience(index, { city: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Description */}
            {item.isOpen && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>

                <Editor
                  apiKey="olzjmmt7ltp5nziuyldtd4pqrcecf9hsvutq9aj2noaesmqz"
                  placeholder="e.g. Created and implemented lesson plans based on child-led interests and curiosities."
                  init={{
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | customButton",
                    setup: (editor) => {
                      editor.ui.registry.addButton("customButton", {
                        text: "AI pre-written phrases +",
                        onAction: () => {},
                        classes: "rounded-lg font-bold text-blue-500",
                      });
                    },
                  }}
                  value={item.description}
                  onEditorChange={(content) =>
                    handleUpdateExperience(index, { description: content })
                  }
                />

                <div className="text-gray-400 text-sm mt-4">
                  Recruiter tip: write 200+ characters to increase interview
                  chances
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No employment history available.</p>
      )}

      <div className="max-w-4xl mx-auto p-6 pb-0 ml-2">
        <button
          className="text-blue-600 text-sm"
          onClick={addEmploymentHistory}
        >
          + Add one more employment
        </button>
      </div>
    </>
  );
}

export default EmploymentHistory;

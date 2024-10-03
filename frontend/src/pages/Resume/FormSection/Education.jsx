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

function Education() {
  const { data, setData } = useContext(DataContext);

  const handleUpdateEducation = (index, updatedField) => {
    const updatedEducation = (data.education || []).map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, education: updatedEducation });
  };

  const toggleEducation = (index) => {
    handleUpdateEducation(index, { isOpen: !data.education[index].isOpen });
  };

  const addEducation = () => {
    const newEducation = {
      universityName: "",
      degree: "",
      startDate: "",
      endDate: "",
      city: "",
      description: "",
      isOpen: true,
    };
    setData({
      ...data,
      education: [...(data.education || []), newEducation],
    });
  };

  const removeEducation = (index) => {
    const updatedEducation = (data.education || []).filter((_, i) => i !== index);
    setData({ ...data, education: updatedEducation });
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2">Education</h2>
        <p className="text-sm text-gray-500 mb-4">
          A varied education on your resume sums up the value that your learnings and background will bring to the job.
        </p>
      </div>

      {(data.education && data.education.length > 0) ? (
        data.education.map((item, index) => (
          <div
            key={index}
            className="education relative max-w-4xl mx-auto p-6 pt-0 bg-white rounded-lg shadow-md mt-6 group"
          >
            <button
              onClick={() => removeEducation(index)}
              className="absolute top-4 right-4 text-red-500 hidden group-hover:block"
            >
              X
            </button>

            <div
              onClick={() => toggleEducation(index)}
              className="cursor-pointer mb-4"
            >
              <h3 className="text-lg font-semibold">
                {item.degree || "(No specified)"}{" "}
                {item.universityName ? `at ${item.universityName}` : ""}
              </h3>
              <p className="text-gray-500">
                {formatMonthYear(item.startDate)} - {formatMonthYear(item.endDate)}
              </p>
            </div>

            {item.isOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* University Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    University
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item.universityName}
                    onChange={(e) =>
                      handleUpdateEducation(index, { universityName: e.target.value })
                    }
                  />
                </div>

                {/* Degree */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Degree
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item.degree}
                    onChange={(e) =>
                      handleUpdateEducation(index, { degree: e.target.value })
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
                        handleUpdateEducation(index, { startDate: e.target.value })
                      }
                    />
                    <input
                      type="month"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item.endDate}
                      onChange={(e) =>
                        handleUpdateEducation(index, { endDate: e.target.value })
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
                      handleUpdateEducation(index, { city: e.target.value })
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
                  placeholder="e.g. Graduated with HIgh Honors."
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
                    handleUpdateEducation(index, { description: content })
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
        <p className="text-center text-gray-500">No education history available.</p>
      )}

      <div className="max-w-4xl mx-auto p-6 pb-0 ml-2">
        <button
          className="text-blue-600 text-sm"
          onClick={addEducation}
        >
          + Add one more education
        </button>
      </div>
    </>
  );
}

export default Education;

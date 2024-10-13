import { useContext } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { DataContext } from "@/context/DataContext";

function Education() {
  const { data, setData } = useContext(DataContext);

  const handleUpdateEducation = (index, updatedField) => {
    const updatedEducation = (data?.education || [])?.map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, education: updatedEducation });
  };

  const handleDateChange = (index, field, value) => {
    const { startDate, endDate } = parseDateRange(data?.education[index]?.date);
    const newDateRange = field === 'startDate'
      ? mergeDateRange(value, endDate)
      : mergeDateRange(startDate, value);
      
    handleUpdateEducation(index, { date: newDateRange });
  };
  

  const toggleEducation = (index) => {
    handleUpdateEducation(index, { isOpen: !data.education[index].isOpen });
  };

  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      date: "",
      major: "",
      gpa: "",
      description: "",
      isOpen: true,
    };
    setData({
      ...data,
      education: [...(data?.education || []), newEducation],
    });
  };

  // const removeEducation = (index) => {
  //   const updatedEducation = (data?.education || []).filter(
  //     (_, i) => i !== index
  //   );
  //   setData({ ...data, education: updatedEducation });
  // };

  const removeEducation = (index) => {
    setData((prevData) => {
      const updatedEducation = (prevData?.education || []).filter(
        (_, i) => i !== index
      );
      return { ...prevData, education: updatedEducation };
    });
  };
  

  // Hàm tách date thành startDate và endDate
  const parseDateRange = (date) => {
    if (!date) return { startDate: "", endDate: "" };
    const [startDate, endDate] = date.split(" - ");
    return { startDate, endDate };
  };

  // Hàm ghép startDate và endDate thành chuỗi date
  const mergeDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) return "";
    if (!endDate) return `${startDate}`;
    if (!startDate) return `${endDate}`;
    return `${startDate} - ${endDate}`;
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8 mt-6 bg-white rounded-lg shadow-md">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Education</h2>
          <p className="text-sm text-gray-500 mb-4">
            A varied education on your resume sums up the value that your
            learnings and background will bring to the job.
          </p>
        </div>

        {data?.education && data?.education?.length > 0 ? (
          data?.education.map((item, index) => {
            const { startDate, endDate } = parseDateRange(item?.date);
            return (
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
                    {item.institution ? `at ${item.institution}` : ""}
                  </h3>
                  <p className="text-gray-500">
                    {startDate} - {endDate}
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
                        name="institution"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={item?.institution}
                        onChange={(e) =>
                          handleUpdateEducation(index, {
                            institution: e.target.value,
                          })
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
                        name="degree"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={item?.degree}
                        onChange={(e) =>
                          handleUpdateEducation(index, {
                            degree: e.target.value,
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
                          type="year"
                          name="startDate"
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={startDate}
                          onChange={(e) => handleDateChange(index, "startDate", e.target.value)}
                        />
                        <input
                          type="year"
                          name="endDate"
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={endDate}
                          onChange={(e) => handleDateChange(index, "endDate", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* GPA */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        GPA
                      </label>
                      <input
                        type="number"
                        name="gpa"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={item?.gpa}
                        onChange={(e) =>
                          handleUpdateEducation(index, { gpa: e.target.value })
                        }
                      />
                    </div>

                    {/* City */}
                    {/* <div>
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
                </div> */}
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
                      // placeholder="e.g. Graduated with HIgh Honors."
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
                      value={item?.description}
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
            );
          })
        ) : (
          <p className="text-center text-gray-500">
            No education history available.
          </p>
        )}

        <div className="max-w-4xl mx-auto p-6 pb-0 ml-2">
          <button className="text-blue-600 text-sm" onClick={addEducation}>
            + Add one more education
          </button>
        </div>
      </div>
    </>
  );
}

export default Education;

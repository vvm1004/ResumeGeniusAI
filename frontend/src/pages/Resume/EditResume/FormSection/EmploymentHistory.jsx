import { useContext, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { DataContext } from "@/context/DataContext";

// Hàm chuyển đổi từ "June 2023" thành "2023-06"
const formatDateToMonthInput = (dateStr) => {
  if (!dateStr) return "";
  const [month, year] = dateStr.split(" ");
  const monthNumber = new Date(Date.parse(`${month} 1`)).getMonth() + 1;
  const formattedMonth = monthNumber < 10 ? `0${monthNumber}` : monthNumber;
  return `${year}-${formattedMonth}`;
};

// Hàm chuyển đổi từ "2023-06" thành "June 2023"
const formatMonthInputToDate = (monthInput) => {
  if (!monthInput) return "";
  const [year, month] = monthInput.split("-");
  const monthName = new Date(monthInput).toLocaleString("default", {
    month: "long",
  });
  return `${monthName} ${year}`;
};

function EmploymentHistory() {
  const { data, setData } = useContext(DataContext);

  const handleUpdateExperience = (index, updatedField) => {
    const updatedExperience = (data?.experience || [])?.map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, experience: updatedExperience });
  };

  const toggleEmploymentHistory = (index) => {
    if (data.experience && data.experience[index]) {
      handleUpdateExperience(index, { isOpen: !data.experience[index].isOpen });
    }
  };

  const addEmploymentHistory = () => {
    const newEmployment = {
      title: "",
      company: "",
      position: "",
      date: "",
      city: "",
      description: "",
      responsibilities: [],
      isOpen: true,
    };
    setData({
      ...data,
      experience: [...(data?.experience || []), newEmployment],
    });
  };

  // const removeEmploymentHistory = (index) => {
  //   const updatedExperience = (data?.experience || []).filter(
  //     (_, i) => i !== index
  //   );
  //   setData({ ...data, experience: updatedExperience });
  // };

  const removeEmploymentHistory = (index) => {
    setData((prevData) => {
      const updatedExperience = (prevData?.experience || []).filter(
        (_, i) => i !== index
      );
      return { ...prevData, experience: updatedExperience };
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
        <div className="max-w-4xl mx-auto pb-0">
          <h2 className="text-2xl font-bold mb-2">Employment History</h2>
          <p className="text-sm text-gray-500 mb-4">
            Show your relevant experience (last 10 years). Use bullet points to
            note your achievements, if possible - use numbers/facts (Achieved X,
            measured by Y, by doing Z).
          </p>
        </div>

        {data?.experience && data?.experience?.length > 0 ? (
          data?.experience?.map((item, index) => {
            const { startDate, endDate } = parseDateRange(item?.date);
            return (
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
                    {item.company ? `at ${item.company}` : ""}
                  </h3>
                  <p className="text-gray-500">
                    {startDate} - {endDate}
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
                        name="title"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={item?.title}
                        onChange={(e) =>
                          handleUpdateExperience(index, {
                            title: e.target.value,
                          })
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
                          handleUpdateExperience(index, {
                            position: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={item?.company}
                        onChange={(e) =>
                          handleUpdateExperience(index, {
                            company: e.target.value,
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
                          name="startDate"
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formatDateToMonthInput(startDate)}
                          onChange={(e) => {
                            const formattedDate = formatMonthInputToDate(
                              e.target.value
                            );
                            handleUpdateExperience(index, {
                              date: mergeDateRange(formattedDate, endDate),
                            });
                          }}
                        />
                        <input
                          type="month"
                          name="endDate"
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formatDateToMonthInput(endDate)}
                          onChange={(e) => {
                            const formattedDate = formatMonthInputToDate(
                              e.target.value
                            );
                            handleUpdateExperience(index, {
                              date: mergeDateRange(startDate, formattedDate),
                            });
                          }}
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
                        name="city"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={item?.city}
                        onChange={(e) =>
                          handleUpdateExperience(index, {
                            city: e.target.value,
                          })
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
                      // placeholder="e.g. Created and implemented lesson plans based on child-led interests and curiosities."
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
                      value={item?.description || ""}
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
            );
          })
        ) : (
          <p className="text-center text-gray-500">
            No employment history available.
          </p>
        )}

        <div className="max-w-4xl mx-auto p-6 pb-0 ml-2">
          <button
            className="text-blue-600 text-sm"
            onClick={addEmploymentHistory}
          >
            + Add one more employment
          </button>
        </div>
      </div>
    </>
  );
}

export default EmploymentHistory;

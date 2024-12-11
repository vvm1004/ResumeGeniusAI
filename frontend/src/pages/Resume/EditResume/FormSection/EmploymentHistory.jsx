import { useContext, useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { DataContext } from "@/context/DataContext";
import { spellCheckText, improveSentence, generateEmploymentHistory } from "../handleContent";
import "./loading.css";
import GenerateSummaryModal from "./GenerateSummaryModal"

import {
  cleanContent,
  applyImproveSentence,
  escapeHtml,
  applyCorrections,
} from "./handleText";
import GenerateWorkingHisModal from "./GenerateWorkingHisModal";

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
  var [curData, setCurData] = useState();

  const handleUpdateExperience = (index, updatedField) => {
    const updatedExperience = (data?.experience || [])?.map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    console.log("updatedExperience:\n", updatedExperience);
    setData({ ...data, experience: updatedExperience });
    setCurData(data.experience)

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

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckSpell, setIsCheckSpell] = useState(0);

  const [showApplyCancel, setShowApplyCancel] = useState([]);

  const [editorValues, setEditorValues] = useState([]);

  useEffect(() => {
    if (editorValues.length > 0) return;
    if (data.experience && Array.isArray(data.experience)) {
      setEditorValues(data.experience.map((item) => item.description));

      const newFalseValues = Array(data.experience.length).fill(false);
      //setIsLoading(newFalseValues);
      setShowApplyCancel(newFalseValues);
    }
    setCurData(data.experience)
  }, [data]);

  const [contentText, setText] = useState("");
  const [originalText, setOriginalText] = useState("");

  const [correctedText, setCorrectedText] = useState("");
  const [index, setIndex] = useState(0);
  const [isHandling, setIsHandling] = useState(false);
  const [notification, setNotification] = useState("");
  const isHandlingRef = useRef(false);
  useEffect(() => {
    isHandlingRef.current = isHandling;
  }, [isHandling]);

  const updateShowApplyCancelValueAtIndex = (index, newValue) => {
    setShowApplyCancel((prevValues) =>
      prevValues.map((value, i) => (i === index ? newValue : value))
    );
  };
  const handleSpellCheck = async () => {
    setIsLoading(true);
    setIsHandling(true);
    setText(contentText.replace(/<\/?p>/g, ""));
    setOriginalText(contentText.replace(/<\/?p>/g, ""));
    //console.log("aaaaaa", contentText.replace(/<\/?p>/g, ''))

    try {
      const result = await spellCheckText(contentText.replace(/<\/?p>/g, ""));
      //console.log("result", result)

      setCorrectedText(result.data.corrected_sentence);
      const corrections = Object.values(result.data.corrections).map((corr) => [
        corr[0],
        corr[1],
      ]);
      const highlightedText = applyCorrections(contentText, corrections);


      setEditorValues((prev) => {
        const newValues = [...prev];
        newValues[index] = highlightedText; // Cập nhật giá trị mới
        //console.log("New Values:", newValues); // Log newValues
        return newValues;
      });
    } catch (error) {
      console.error("Error while checking spelling:", error);
    } finally {
      setIsLoading(false);
      setIsCheckSpell(1);

      updateShowApplyCancelValueAtIndex(index, true);
      console.log(
        "\nindex:",
        index,
        "\nshow: ",
        showApplyCancel[index],
        "\nischeck: ",
        isCheckSpell
      );
    }
  };

  const handleApply = async () => {
    updateShowApplyCancelValueAtIndex(index, false);
    setIsHandling(false);

    if (contentText.length < 2) return;
    setEditorValues((prev) => {
      const newValues = [...prev];
      newValues[index] = correctedText;
      return newValues;
    });
    handleUpdateExperience(index, { description: correctedText });
    setIsCheckSpell(0);
  };

  const handleCancel = async () => {
    updateShowApplyCancelValueAtIndex(index, false);
    setIsHandling(false);

    if (contentText.length < 2) return;
    setEditorValues((prev) => {
      const newValues = [...prev];
      newValues[index] = originalText;
      return newValues;
    });
    setIsCheckSpell(0);
  };
  const handleImproveSentence = async () => {
    if (contentText.length < 2) return;
    setIsLoading(true);
    setIsHandling(true);

    var hanText = cleanContent(contentText);

    setText(hanText);
    setOriginalText(hanText);

    try {
      const result = await improveSentence(hanText);
      console.log("result", result);

      setCorrectedText(result.data);

      var highlightedText = applyImproveSentence(hanText, result.data);

      // console.log("editorValues:\n", editorValues)
      // highlightedText = highlightedText.replace(/<\/?p>/g, '')
      //console.log(index, "highlightedText:\n", highlightedText)
      highlightedText = highlightedText
        .replace(/&lt;p&gt;/g, "")
        .replace(/&lt;\/p&gt;/g, "");
      //console.log(index, "highlightedText:\n", highlightedText)

      setEditorValues((prev) => {
        const newValues = [...prev];
        newValues[index] = highlightedText; // Cập nhật giá trị mới
        //console.log("New Values:", newValues); // Log newValues
        return newValues;
      });
      //console.log("editorValues[index]", editorValues[index])
    } catch (error) {
      console.error("Error while checking spelling:", error);
    } finally {
      console.log("check2", editorValues);

      setIsLoading(false);
      setIsCheckSpell(2);

      updateShowApplyCancelValueAtIndex(index, true);
    }
  };

  const handleEditorClick = () => {
    console.log("handleEditorClick: ", isHandlingRef.current);

    if (isHandlingRef.current) {
      setNotification("Is handling...");
      setTimeout(() => {
        setNotification("");
      }, 5000);
    }
  };





  const [summaryModalOpen, setSunnaryModalOpen] = useState(false);
  var [buttonPosition, setButtonPosition] = useState({});
  const [genSummaryData, setGenSummaryData] = useState({});
  const [openModalIndex, setOpenModalIndex] = useState(null);

  const genSummary = async (desIndex, e) => {
    if (curData[index].title == "") {
      setIsHandling(true)
      checkRequire()
      return;
    }


    setIsLoading(true)
    const timer = setTimeout(() => {
    }, 2000);
    var newSummary = await generateEmploymentHistory(curData[index].title, curData[index].position)
    setGenSummaryData(newSummary)
    setIsLoading(false)
    console.log("newSummary:", newSummary)


    const rect = e.target.getBoundingClientRect();
    setButtonPosition({
      top: rect.bottom + window.screenY,
      left: rect.left + window.scrollX
    });
    console.log("Button Rect:", rect);
    console.log("buttonPosition:", window.scrollY, "\n",
      window.screenX);
    setIndex(desIndex)
    setSunnaryModalOpen(true);
    setOpenModalIndex(desIndex);


  }


  const handleSummarySelect = (text, i) => {

    setEditorValues((prev) => {
      const newValues = [...prev];
      newValues[index] = text;
      return newValues;
    });

    console.log("handleSummarySelect", text, "\n", index, "\n", editorValues[index])
    handleUpdateExperience(index, { description: text });
    setSunnaryModalOpen(false);

  };

  const handleTextChange = (text) => {
    if (isCheckSpell) return;
    console.log(text)
    handleUpdateExperience(index, { description: text.replace(/<\/?p>/g, '') });

  }


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
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div>
                        <button
                          className="ml-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={(e) => genSummary(index, e)}
                        >
                          Generate with AI
                        </button>

                        <GenerateWorkingHisModal
                          isOpen={summaryModalOpen && openModalIndex === index}
                          onClose={() => { setSunnaryModalOpen(false); setOpenModalIndex(null); }}
                          data={genSummaryData}
                          onSelect={handleSummarySelect}
                          position={buttonPosition}
                          index={index}
                        />


                        {showApplyCancel[index] && isCheckSpell == 1 ? (
                          <>
                            <button
                              className="ml-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              onClick={handleApply}
                            >
                              Apply
                            </button>
                            <button
                              className="ml-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </>
                        ) : isCheckSpell !== 2 ? (
                          <button
                            className="ml-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={handleSpellCheck}
                          >
                            Check Spelling
                          </button>
                        ) : null}
                        {showApplyCancel[index] && isCheckSpell == 2 ? (
                          <>
                            <button
                              className="ml-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              onClick={handleApply}
                            >
                              Apply
                            </button>
                            <button
                              className="ml-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </>
                        ) : isCheckSpell !== 1 ? (
                          <button
                            className="ml-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={handleImproveSentence}
                          >
                            Upgrade
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {notification && (
                      <div className="notification">{notification}</div>
                    )}

                    <Editor
                      apiKey={`${import.meta.env.VITE_EDITOR}`}
                      // placeholder="e.g. Created and implemented lesson plans based on child-led interests and curiosities."
                      init={{
                        menubar: false,
                        plugins: [
                          "advlist autolink lists link image charmap print preview anchor",
                          "searchreplace visualblocks code fullscreen",
                          "insertdatetime media table paste code help wordcount",
                        ],
                        toolbar:
                          "formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | customButton ",
                        setup: (editor) => {
                          editor.ui.registry.addButton("customButton", {
                            text: "AI pre-written phrases +",
                            onAction: () => { },
                            classes: "rounded-lg font-bold text-blue-500",
                          });
                          editor.on("keydown", (event) => {
                            if (isHandlingRef.current == true) {
                              event.preventDefault();
                            }
                          });

                          editor.on("click", handleEditorClick);
                        },
                      }}
                      value={editorValues[index] || ""}
                      onEditorChange={(content) => {
                        setIndex(index);
                        setText(content);
                        setEditorValues((prev) => {
                          const newValues = [...prev];
                          newValues[index] = content; // Cập nhật giá trị tương ứng
                          return newValues;
                        });
                        handleTextChange(content);
                      }}
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
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="loader"></div>{" "}
          {/* Bạn có thể thêm CSS để tạo hiệu ứng quay tròn */}
        </div>
      )}
    </>
  );
}

export default EmploymentHistory;

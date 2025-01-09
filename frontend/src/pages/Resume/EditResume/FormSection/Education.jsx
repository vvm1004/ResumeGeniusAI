import { Editor } from "@tinymce/tinymce-react";
import { DataContext } from "@/context/DataContext";
import { useContext, useEffect, useState, useRef } from "react";

import { spellCheckText, improveSentence } from "../handleContent"
import "./loading.css"
import { cleanContent, applyImproveSentence, escapeHtml, applyCorrections } from "./handleText"

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






  const [isLoading, setIsLoading] = useState(false);
  const [isCheckSpell, setIsCheckSpell] = useState(0);

  const [showApplyCancel, setShowApplyCancel] = useState([]);

  const [editorValues, setEditorValues] = useState([]);

  useEffect(() => {
    if (editorValues.length > 0) return;
    if (data.education && Array.isArray(data.education)) {
      setEditorValues(data.education.map(item => item.description));
      const newFalseValues = Array(data.education.length).fill(false);
      setShowApplyCancel(newFalseValues);
    }
  }, [data]);

  const [contentText, setText] = useState('');
  const [originalText, setOriginalText] = useState('');

  const [correctedText, setCorrectedText] = useState('');
  const [index, setIndex] = useState(0)
  const [isHandling, setIsHandling] = useState(false);
  const [notification, setNotification] = useState('');
  const isHandlingRef = useRef(false);
  useEffect(() => {
    isHandlingRef.current = isHandling;
  }, [isHandling]);


  const updateShowApplyCancelValueAtIndex = (index, newValue) => {
    setShowApplyCancel(prevValues =>
      prevValues.map((value, i) => (i === index ? newValue : value))
    );
  };
  const handleSpellCheck = async () => {
    setIsLoading(true)
    setIsHandling(true)

    setText(contentText.replace(/<\/?p>/g, ''))
    setOriginalText(contentText.replace(/<\/?p>/g, ''))


    try {

      const result = await spellCheckText(contentText.replace(/<\/?p>/g, ''));

      setCorrectedText(result.data.corrected_sentence);

      const corrections = result.data.corrections.map(corr => [corr.original, corr.corrected]);
      console.log("corrections1", corrections)
      const highlightedText = applyCorrections(contentText, corrections);




      setEditorValues((prev) => {
        const newValues = [...prev];
        newValues[index] = highlightedText; // Cập nhật giá trị mới
        return newValues;
      });


    } catch (error) {
      console.error('Error while checking spelling:', error);
    } finally {
      setIsLoading(false)
      setIsCheckSpell(1)

      updateShowApplyCancelValueAtIndex(index, true)
      console.log("\nindex:", index, "\nshow: ", showApplyCancel[index], "\nischeck: ", isCheckSpell)
    }
  };

  const handleApply = async () => {
    updateShowApplyCancelValueAtIndex(index, false)
    setIsHandling(false)

    if (contentText.length < 2) return;
    setEditorValues((prev) => {
      const newValues = [...prev];
      newValues[index] = correctedText;
      return newValues;
    });
    handleUpdateEducation(index, { description: correctedText });
    setIsCheckSpell(0)
  };
  const handleChange = (text) => {
    handleUpdateEducation(index, { description: cleanContent(text.replace(/<\/?[^>]+(>|$)/g, '')) });

  }

  const handleCancel = async () => {
    updateShowApplyCancelValueAtIndex(index, false)
    setIsHandling(false)

    if (contentText.length < 2) return;
    setEditorValues((prev) => {
      const newValues = [...prev];
      newValues[index] = originalText;
      return newValues;
    });
    setIsCheckSpell(0)

  };
  const handleImproveSentence = async () => {

    if (contentText.length < 2) return;
    setIsLoading(true)
    setIsHandling(true)

    var hanText = cleanContent(contentText)

    setText(hanText)
    setOriginalText(hanText)

    try {

      const result = await improveSentence(hanText);
      console.log("result", result)

      setCorrectedText(result.data);

      var highlightedText = applyImproveSentence(hanText, result.data);

      highlightedText = highlightedText.replace(/&lt;p&gt;/g, '').replace(/&lt;\/p&gt;/g, '');

      console.log(index, "highlightedText:\n", highlightedText)

      setEditorValues((prev) => {
        const newValues = [...prev];
        newValues[index] = highlightedText; // Cập nhật giá trị mới
        return newValues;
      });


    } catch (error) {
      console.error('Error while checking spelling:', error);
    } finally {
      setIsLoading(false)
      setIsCheckSpell(2)

      updateShowApplyCancelValueAtIndex(index, true)

    }

  };
  const handleEditorClick = () => {
    console.log("handleEditorClick: ", isHandlingRef.current)

    if (isHandlingRef.current) {
      setNotification('Is handling...');
      setTimeout(() => {
        setNotification('');
      }, 5000);
    }
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


                  </div>
                )}

                {/* Description */}
                {item.isOpen && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <div>
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
                    {notification && <div className="notification">{notification}</div>}

                    <Editor
                      apiKey={`${import.meta.env.VITE_EDITOR}`}
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
                            onAction: () => { },
                            classes: "rounded-lg font-bold text-blue-500",
                          });
                          editor.on('keydown', (event) => {
                            if (isHandlingRef.current == true) {
                              event.preventDefault();
                            }
                          });

                          editor.on('click', handleEditorClick);
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
                        handleChange(content)
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
            No education history available.
          </p>
        )}

        <div className="max-w-4xl mx-auto p-6 pb-0 ml-2">
          <button className="text-blue-600 text-sm" onClick={addEducation}>
            + Add one more education
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="loader"></div>
        </div>
      )}
    </>
  );
}

export default Education;

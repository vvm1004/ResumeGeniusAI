import { DataContext } from "@/context/DataContext";
import { Editor } from "@tinymce/tinymce-react";
import { useContext, useEffect, useState } from "react";

import { spellCheckText, improveSentence } from "../handleContent"
import "./loading.css"
function Projects() {
  const { data, setData } = useContext(DataContext);

  const handleUpdateProjects = (index, updatedField) => {
    const updatedProject = (data?.projects || [])?.map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, projects: updatedProject });
  };

  const toggleProjects = (index) => {
    handleUpdateProjects(index, { isOpen: !data.projects[index].isOpen });
  };

  const addNewProject = () => {
    const newProject = {
      title: "",
      description: "",
      features: "",
      technologies: "",
      demo: "",
      githubLink: "",
      date: "",
      tool: "",
      isOpen: true,
    };
    setData({
      ...data,
      projects: [...(data?.projects || []), newProject],
    });
  };

  const removeProjects = (index) => {
    const updatedProject = (data?.projects || []).filter((_, i) => i !== index);
    setData({ ...data, projects: updatedProject });
  };






  const [isLoading, setIsLoading] = useState(false);
  const [ísCheckSpell, setIsCheckSpell] = useState(0);

  const [showApplyCancel, setShowApplyCancel] = useState([]);

  const [editorValues, setEditorValues] = useState([]);
  // const [isLoading, setIsLoading] = useState([]);

  useEffect(() => {
    if (editorValues.length > 0) return;
    if (data.projects && Array.isArray(data.projects)) {
      setEditorValues(data.projects.map(item => item.description));

      const newFalseValues = Array(data.projects.length).fill(false);
      //setIsLoading(newFalseValues);
      setShowApplyCancel(newFalseValues);
    }
  }, [data]);

  const [contentText, setText] = useState('');
  const [originalText, setOriginalText] = useState('');

  const [correctedText, setCorrectedText] = useState('');
  const [index, setIndex] = useState(0)


  const updateShowApplyCancelValueAtIndex = (index, newValue) => {
    setShowApplyCancel(prevValues =>
      prevValues.map((value, i) => (i === index ? newValue : value))
    );
  };
  const handleSpellCheck = async () => {
    setIsLoading(true)
    setIsCheckSpell(1)
    setText(contentText.replace(/<\/?p>/g, ''))
    setOriginalText(contentText.replace(/<\/?p>/g, ''))


    try {

      const result = await spellCheckText(contentText.replace(/<\/?p>/g, ''));

      setCorrectedText(result.data.corrected_sentence);
      const corrections = Object.values(result.data.corrections).map(corr => [corr[0], corr[1]]);
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
      updateShowApplyCancelValueAtIndex(index, true)
      console.log("\nindex:", index, "\nshow: ", showApplyCancel[index], "\nischeck: ", ísCheckSpell)
    }
  };
  const applyCorrections = (sentence, corrections) => {
    let highlightedSentence = sentence; // Bắt đầu với câu gốc
    console.log("corrections:\n", corrections)

    corrections.forEach(([wrongWord, correctWord]) => {
      const wrongSpan = `<span style="background-color: rgb(224, 62, 45);" >${escapeHtml(wrongWord)}</span>`;
      const correctSpan = `<span style="background-color: rgb(45, 194, 107);" >${escapeHtml(correctWord)}</span>`;
      highlightedSentence = highlightedSentence.replace(
        new RegExp(`\\b${escapeRegExp(wrongWord)}\\b`, 'g'),
        `${wrongSpan} ${correctSpan}`
      );
      console.log("highlightedSentence:\n", wrongWord, "\t\t", correctWord)

    });

    return highlightedSentence;
  };
  // Hàm escape HTML
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  // Hàm escape ký tự trong biểu thức chính quy
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  const handleApply = async () => {
    updateShowApplyCancelValueAtIndex(index, false)

    if (contentText.length < 2) return;
    setEditorValues((prev) => {
      const newValues = [...prev];
      newValues[index] = correctedText;
      return newValues;
    });
    handleUpdateProjects(index, { description: correctedText });
    setIsCheckSpell(0)
  };

  const handleCancel = async () => {
    updateShowApplyCancelValueAtIndex(index, false)

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
    setIsCheckSpell(2)
    setText(contentText.replace(/<\/?p>/g, ''))
    setOriginalText(contentText.replace(/<\/?p>/g, ''))


    try {

      const result = await improveSentence(contentText.replace(/<\/?p>/g, ''));
      console.log("result", result)

      setCorrectedText(result.data);

      var highlightedText = applyImproveSentence(contentText, result.data);

      highlightedText = highlightedText.replace(/<\/?p>/g, '')
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
      updateShowApplyCancelValueAtIndex(index, true)

    }

  };
  const applyImproveSentence = (originalSentence, improveSentence) => {

    originalSentence = `<span style="background-color: rgb(224, 62, 45);" >${escapeHtml(originalSentence)}</span>`;
    improveSentence = `<span style="background-color: rgb(45, 194, 107);" >${escapeHtml(improveSentence)}</span>`;

    let highlightedSentence = originalSentence + "\n\n" + improveSentence; // Bắt đầu với câu gốc

    return highlightedSentence;
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8 mt-6 bg-white rounded-lg shadow-md">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Projects</h2>
          <div className="text-sm text-gray-500 mb-4">
            Share projects you've worked on that you're proud of! These can be
            personal, collaborative, or work projects. Don't forget to include
            links to websites, source code, or related documentation so others
            can learn more about them.
          </div>
        </div>

        {data?.projects && data?.projects?.length > 0 ? (
          data?.projects?.map((item, index) => (
            <div
              key={index}
              className="relative max-w-4xl mx-auto p-6 pt-0 bg-white rounded-lg shadow-md mt-6 group"
            >
              <button
                onClick={() => removeProjects(index)}
                className="absolute top-4 right-4 text-red-500 hidden group-hover:block"
              >
                X
              </button>

              <div
                onClick={() => toggleProjects(index)}
                className="cursor-pointer mb-4"
              >
                <h3 className="text-lg font-semibold">
                  {item?.title || "(No specified)"}{" "}
                </h3>
                {item?.githubLink ? item?.githubLink : ""}
                <h2></h2>
              </div>

              {item.isOpen && (
                <><div className="grid grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item?.title}
                      onChange={(e) => handleUpdateProjects(index, { title: e.target.value })} />
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Technologies
                    </label>
                    <input
                      type="text"
                      name="technologies"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item?.technologies}
                      onChange={(e) => handleUpdateProjects(index, {
                        technologies: e.target.value,
                      })} />
                  </div>

                  {/* Link */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Link (Github, Website,...)
                    </label>
                    <input
                      type="text"
                      name="githubLink"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item?.githubLink}
                      onChange={(e) => handleUpdateProjects(index, {
                        githubLink: e.target.value,
                      })} />
                  </div>

                </div>
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <div>
                        {showApplyCancel[index] && ísCheckSpell == 1 ? (
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
                        ) : (
                          <button
                            className="ml-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={handleSpellCheck}
                          >
                            Check Spelling
                          </button>
                        )}
                        {showApplyCancel[index] && ísCheckSpell == 2 ? (
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
                        ) : (
                          <button
                            className="ml-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={handleImproveSentence}
                          >
                            Upgrade
                          </button>
                        )}

                      </div>
                    </div><div className="col-span-2">
                      <Editor
                        apiKey="olzjmmt7ltp5nziuyldtd4pqrcecf9hsvutq9aj2noaesmqz"
                        init={{
                          menubar: false,
                          plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount",
                          ],
                          toolbar: "formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | customButton",
                          setup: (editor) => {
                            editor.ui.registry.addButton("customButton", {
                              text: "AI pre-written phrases +",
                              onAction: () => {
                                alert("Feature coming soon!");
                              },
                              classes: "rounded-lg font-bold text-blue-500",
                            });
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
                        }} />
                    </div>
                  </div></>

              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No websites or social links available.
          </p>
        )}

        <div className="max-w-4xl mx-auto p-6 pb-0 ml-2">
          <button className="text-blue-600 text-sm" onClick={addNewProject}>
            + Add one more website or social link
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="loader"></div> {/* Bạn có thể thêm CSS để tạo hiệu ứng quay tròn */}
        </div>
      )}
    </>
  );
}

export default Projects;

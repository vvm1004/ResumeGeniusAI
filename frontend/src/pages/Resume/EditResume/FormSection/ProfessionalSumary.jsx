import { DataContext } from "@/context/DataContext";
import { Editor } from "@tinymce/tinymce-react";
import { useContext, useEffect, useState } from "react";

import { spellCheckText, improveSentence } from "../handleContent"
import "./loading.css"
function ProfessionalSummary() {
  const { data, setData } = useContext(DataContext);
  const [charCount, setCharCount] = useState(data?.summary?.length || 0);

  const handleEditorChange = (content) => {
    if (content.length <= 600 && content !== data.summary) {
      setCharCount(content.length);
      setData({ ...data, summary: content });
    }
  };






  const [isLoading, setIsLoading] = useState(false);
  const [ísCheckSpell, setIsCheckSpell] = useState(0);

  const [showApplyCancel, setShowApplyCancel] = useState(false);

  const [editorValues, setEditorValues] = useState('');

  useEffect(() => {
    if (editorValues == data.summary) return;
    setEditorValues(data.summary);

  }, [data]);

  const [contentText, setText] = useState('');
  const [originalText, setOriginalText] = useState('');

  const [correctedText, setCorrectedText] = useState('');
  const [index, setIndex] = useState(0)



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




      setEditorValues(highlightedText);


    } catch (error) {
      console.error('Error while checking spelling:', error);
    } finally {
      setIsLoading(false)
      setShowApplyCancel(true)
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
    setShowApplyCancel(false)
    if (contentText.length < 2) return;
    setEditorValues(correctedText);

    handleEditorChange(correctedText);
    setIsCheckSpell(0)
  };

  const handleCancel = async () => {
    setShowApplyCancel(false)

    if (contentText.length < 2) return;
    setEditorValues(originalText);

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

      setEditorValues(highlightedText);



    } catch (error) {
      console.error('Error while checking spelling:', error);
    } finally {
      setIsLoading(false)
      setShowApplyCancel(true)

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

      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-bold mb-2">Professional Summary</h2>
        <div className="text-sm text-gray-500 mb-4">
          Write 2-4 short, energetic sentences about how great you are. Mention
          the role and what you did. What were the big achievements? Describe your
          motivation and list your skills.
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700"></label>
            <div>
              {showApplyCancel && ísCheckSpell == 1 ? (
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
              {showApplyCancel && ísCheckSpell == 2 ? (
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
          </div>
          <Editor
            apiKey="olzjmmt7ltp5nziuyldtd4pqrcecf9hsvutq9aj2noaesmqz"
            placeholder="Curious science teacher with 8+ years of experience and a track record of..."
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
                  onAction: () => {
                    alert("Feature coming soon!");
                  },
                  classes: "rounded-lg font-bold text-blue-500",
                });
              },
            }}
            value={editorValues || ""}

            onEditorChange={(content) => {
              setIndex(index);
              setText(content);
              setEditorValues(content);
            }}
          />
        </div>
        {/* Recruiter tip */}
        <div className="flex justify-between text-gray-400 text-sm mt-4">
          <div>
            Recruiter tip: write 400-600 characters to increase interview chances
          </div>
          <div>{charCount} / 600</div>
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

export default ProfessionalSummary;

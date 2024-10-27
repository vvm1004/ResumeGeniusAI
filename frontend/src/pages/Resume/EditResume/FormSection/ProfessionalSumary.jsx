import { DataContext } from "@/context/DataContext";
import { Editor } from "@tinymce/tinymce-react";
import { useContext, useEffect, useState, useRef } from "react";

import { spellCheckText, improveSentence } from "../handleContent"
import "./loading.css"
import { cleanContent, applyImproveSentence, escapeHtml, applyCorrections } from "./handleText"
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
  const [isCheckSpell, setIsCheckSpell] = useState(0);

  const [showApplyCancel, setShowApplyCancel] = useState(false);

  const [editorValues, setEditorValues] = useState('');
  const [isHandling, setIsHandling] = useState(false);
  const [notification, setNotification] = useState('');
  const isHandlingRef = useRef(false);

  useEffect(() => {
    if (editorValues == data.summary) return;
    setEditorValues(data.summary);

  }, [data]);

  // useEffect(() => {
  //   console.log("isHandling updated: ", isHandling);

  // }, [isHandling]);


  useEffect(() => {
    isHandlingRef.current = isHandling;
  }, [isHandling]);

  const [contentText, setText] = useState('');
  const [originalText, setOriginalText] = useState('');
  useEffect(() => {
    console.log("contentText updated: ", contentText);
  }, [contentText]);

  const [correctedText, setCorrectedText] = useState('');
  const [index, setIndex] = useState(0)
  const handleEditorClick = () => {
    console.log("handleEditorClick: ", isHandlingRef.current)

    if (isHandlingRef.current) {
      setNotification('Is handling...');
      setTimeout(() => {
        setNotification('');
      }, 5000);
    }
  };


  const handleSpellCheck = async () => {
    setIsHandling(true)
    setIsLoading(true)
    setText(contentText.replace(/<\/?p>/g, ''))
    setOriginalText(contentText.replace(/<\/?p>/g, ''))
    console.log("han2: ", isHandling)


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
      setIsCheckSpell(1)

      console.log("\nindex:", index, "\nshow: ", showApplyCancel[index], "\nischeck: ", isCheckSpell)
    }
  };

  const handleApply = async () => {
    setIsHandling(false)

    setShowApplyCancel(false)
    if (contentText.length < 2) return;
    setEditorValues(correctedText);

    handleEditorChange(correctedText);
    setIsCheckSpell(0)
  };

  const handleCancel = async () => {
    setIsHandling(false)

    setShowApplyCancel(false)

    if (contentText.length < 2) return;
    setEditorValues(originalText);

    setIsCheckSpell(0)

  };
  const handleImproveSentence = async () => {

    if (contentText.length < 2) return;
    setIsHandling(true)
    console.log("han3: ", isHandling)

    setIsLoading(true)
    //console.log("content11: ", contentText)

    var hanText = cleanContent(contentText)

    setText(hanText)
    setOriginalText(hanText)


    try {

      const result = await improveSentence(hanText);
      setCorrectedText(result.data);
      var highlightedText = applyImproveSentence(hanText, result.data);
      highlightedText = highlightedText.replace(/&lt;p&gt;/g, '').replace(/&lt;\/p&gt;/g, '');
      setEditorValues(highlightedText);



    } catch (error) {
      console.error('Error while checking spelling:', error);
    } finally {
      setIsLoading(false)
      setShowApplyCancel(true)
      setIsCheckSpell(2)


    }

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
              {showApplyCancel && isCheckSpell == 1 ? (
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

              {showApplyCancel && isCheckSpell == 2 ? (
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
                editor.on('keydown', (event) => {
                  if (isHandlingRef.current == true) {
                    event.preventDefault();
                  }
                });

                editor.on('click', handleEditorClick);
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

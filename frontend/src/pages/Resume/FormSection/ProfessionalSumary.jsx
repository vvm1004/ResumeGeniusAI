import { Editor } from "@tinymce/tinymce-react";
import { useContext, useState } from "react";
import { DataContext } from "../../../context/DataContext";

function ProfessionalSummary() {
  const { data, setData } = useContext(DataContext); 
  const [charCount, setCharCount] = useState(data.summery?.length || 0);

  const handleEditorChange = (content) => {
    setCharCount(content.length); 
    setData({ ...data, summery: content }); 
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-2">Professional Summary</h2>
      <div className="text-sm text-gray-500 mb-4">
        Write 2-4 short, energetic sentences about how great you are. Mention
        the role and what you did. What were the big achievements? Describe your
        motivation and list your skills.
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
              onAction: () => {},
              classes: "rounded-lg font-bold text-blue-500",
            });
          },
        }}
        value={data.summery}
        onEditorChange={handleEditorChange}
      />

      {/* Recruiter tip */}
      <div className="flex justify-between text-gray-400 text-sm mt-4">
        <div>
          Recruiter tip: write 400-600 characters to increase interview chances
        </div>
        <div>{charCount} / 600</div>
      </div>
    </div>
  );
}

export default ProfessionalSummary;

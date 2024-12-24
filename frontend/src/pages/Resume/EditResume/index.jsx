// import { DataContext } from "@/context/DataContext";
// import FormSection from "./FormSection";
// import ResumePreview from "./ResumePreview";

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// function EditResume() {
//   const { id } = useParams();
//   const [data, setData] = useState([]);
//   const access_token = localStorage.getItem("access_token");
//   useEffect(() => {
//     const fetchResume = async () => {
//       try {
//         if (id !== "undefined") {
//           const response = await axios.get(
//             `${import.meta.env.VITE_BACKEND_URL
//             }/api/v1/resume-builders/${id}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${access_token}`,
//               },
//             }
//           );
//           setData(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching resume data!", error);
//       }
//     };

//     fetchResume();
//   }, [id, access_token]);

//   return (
//     <>
//       <DataContext.Provider value={{ data, setData, id, access_token }}>
//         <div className="resume min-h-screen flex">
//           <div className="w-1/2 p-4">
//             <FormSection />
//           </div>

//           <div className="w-1/2 h-screen mt-12 p-4 bg-gray-500 fixed top-0 right-0 ">
//             <ResumePreview />
//           </div>
//         </div>
//       </DataContext.Provider>
//     </>
//   );
// }

// export default EditResume;
import { DataContext } from "@/context/DataContext";
import FormSection from "./FormSection";
import ResumePreview from "./ResumePreview";
import TemplateSelection from "./TemplateSelection/index";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillAppstore } from "react-icons/ai";

function EditResume() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const access_token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        if (id !== "undefined") {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/resume-builders/${id}`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          setData(response.data.data);
          setSelectedTemplate(response.data.data.template._id);
        }
      } catch (error) {
        console.error("Error fetching resume data!", error);
      }
    };

    const fetchTemplateData = async () => {
      try {
        if (templates.length === 0) {
          const response2 = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/template`
          );
          setTemplates(response2.data.data.result);
        }
      } catch (error) {
        console.error("Error fetching template data!", error);
      }
    };

    fetchTemplateData();
    fetchResume();
  }, [id, access_token]);
  const handleView = () => {
    if (id) {
      navigate(`/resumes/view/${id}`);
    } else {
      console.error("ID is undefined or invalid!");
    }
  };

  const toggleTemplateSelection = () => {
    setShowTemplateSelection((prevState) => !prevState);
  };
  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        id,
        access_token,
        toggleTemplateSelection,
        selectedTemplate,
        setSelectedTemplate,
        templates,
      }}
    >
      <div>
        {showTemplateSelection ? (
          <div className="bg-white rounded-lg shadow-lg h-screen">
            <TemplateSelection />
          </div>
        ) : (
          <div className="flex min-h-screen" style={{ height: "100vh" }}>
            <div
              className="w-full lg:w-1/2 p-4 overflow-y-auto"
              style={{ height: "100vh" }}
            >
              <FormSection />
            </div>

            {/* Cột bên phải */}
            <div
              className="hidden lg:flex w-1/2 min-h-screen bg-gray-500 overflow-hidden flex-col "
              style={{ height: "100vh" }}
            >
              <div
                className="flex items-center justify-between bg-gray-200 p-4 w-full"
                style={{ height: "5%" }}
              >
                <div className="flex items-center">
                  <AiFillAppstore className="text-3xl mr-2" />
                  <button
                    onClick={toggleTemplateSelection}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Choose Template
                  </button>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={handleView}
                    className="bg-green-500 text-white px-4 py-2 ml-4 rounded"
                  >
                    View
                  </button>
                </div>
              </div>

              <div
                className="justify-center"
                // style={{ height: "95%" }}
              >
                <div className="h-[120vh] transform scale-[0.7] overflow-auto -translate-y-20 border-2 rounded-xl">
                  <ResumePreview />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DataContext.Provider>
  );
}

export default EditResume;

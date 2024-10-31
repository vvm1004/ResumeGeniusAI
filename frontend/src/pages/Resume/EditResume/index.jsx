import { DataContext } from "@/context/DataContext";
import FormSection from "./FormSection";
import ResumePreview from "./ResumePreview";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EditResume() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const access_token = localStorage.getItem("access_token");
  useEffect(() => {
    const fetchResume = async () => {
      try {
        if (id !== "undefined") {
          const response = await axios.get(
            `http://localhost:8000/api/v1/resume-builders/${id}`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching resume data!", error);
      }
    };

    fetchResume();
  }, [id, access_token]);

  return (
    <>
      <DataContext.Provider value={{ data, setData, id, access_token }}>
        <div className="resume min-h-screen flex">
          <div className="w-1/2 p-4">
            <FormSection />
          </div>

          <div className="w-1/2 h-screen mt-12 p-4 bg-gray-500 fixed top-0 right-0 overflow-auto">
            <ResumePreview />
          </div>
        </div>
      </DataContext.Provider>
    </>
  );
}

export default EditResume;

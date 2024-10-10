import { DataContext } from "@/context/DataContext";
import FormSection from "./FormSection";
import ResumePreview from "./ResumePreview";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EditResume() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/resumes/${id}`
        );
        console.log(response.data.data);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching resume data!", error);
      }
    };

    fetchResume();
  }, [id]); 

  return (
    <>
      <DataContext.Provider value={{ data, setData }}>
        <div className="resume min-h-screen flex">
          <div className="w-1/2 p-4">
            <FormSection />
          </div>

          <div
            className="w-1/2 mt-10 p-4 bg-gray-500 fixed top-0 right-0 h-screen"
            style={{ height: "100vh" }}
          >
            <ResumePreview />
          </div>
        </div>
      </DataContext.Provider>
    </>
  );
}

export default EditResume;

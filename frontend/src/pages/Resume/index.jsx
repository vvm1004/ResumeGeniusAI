import axios from "axios";
import { useEffect, useState } from "react";
import FormSection from "./FormSection";
import ResumePreview from "./ResumePreview";
import { DataContext } from "../../context/DataContext";

function Resume() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await axios.get("http://localhost:4000/resume");
        setData(response.data[0]);
      } catch {
        console.log("Error!");
      }
    };
    fetchApi();
  }, []);

  useEffect(() => {
    const updateApi = async () => {
      try {
        await axios.patch("http://localhost:4000/resume/1", data);
        console.log("Data updated successfully!");
      } catch (error) {
        console.log("Error updating data!", error);
      }
    };

    updateApi();
  }, [data]);

  return (
    <>
      <DataContext.Provider value={{ data, setData }}>
        <div className="resume min-h-screen flex">
          <div className="w-1/2 p-4">
            <FormSection />
          </div>

          <div
            className="w-1/2 p-4 bg-gray-500 fixed top-0 right-0 h-screen"
            style={{ height: "100vh" }}
          >
            <ResumePreview />
          </div>
        </div>
      </DataContext.Provider>
    </>
  );
}

export default Resume;

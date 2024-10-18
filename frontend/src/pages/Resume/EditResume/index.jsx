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
  }, [id]);

  // useEffect(() => {
  //   const updateResume = async () => {
  //     if (data && id !== "undefined") {
  //       try {
  //         await axios.patch(
  //           `http://localhost:8000/api/v1/resume-builders/${id}`,
  //           data,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${access_token}`,
  //             },
  //           }
  //         );
  //       } catch (error) {
  //         console.error("Error updating resume!", error);
  //       }
  //     }
  //   };
  //   updateResume();
  // }, [data, id]);


  return (
    <>
      <DataContext.Provider value={{ data, setData }}>
        <div className="resume min-h-screen flex">
          <div className="w-1/2 p-4">
            <FormSection id={id} access_token={access_token}/>
          </div>

          <div className="w-1/2 h-screen mt-12 p-4 bg-gray-500 fixed top-0 right-0">
            <ResumePreview />
          </div>
        </div>
      </DataContext.Provider>
    </>
  );
}

export default EditResume;

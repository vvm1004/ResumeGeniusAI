import ResumePreview from "../EditResume/ResumePreview/index";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { RWebShare } from "react-web-share";
import { DataContext } from "@/context/DataContext";

function ViewResume() {
  const [data, setData] = useState(null); // Sử dụng null thay vì undefined để dễ kiểm tra
  const { id } = useParams();
  const access_token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  // Hàm gọi API để lấy thông tin resume
  useEffect(() => {
    if (id && access_token) {
      GetResumeInfo();
    }
  }, [id, access_token]); // Chạy lại khi id hoặc access_token thay đổi

  const GetResumeInfo = async () => {
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
      }
    } catch (error) {
      console.error("Error fetching resume data!", error);
    }
  };

  const HandleDownload = () => {
    window.print();
  };
  if (!data) {
    return (
      <div className="loading-state">
        <p>Loading resume information...</p>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ data, setData, id, access_token }}>
      <div id="no-print">
        <div className="my-10 mx-10 md:mx-20 lg:mx-80">
          <h2 className="text-center text-2xl font-medium">
            Congrats! Your Ultimate AI generated Resume is ready!
          </h2>
          <p className="text-center text-gray-400">
            Now you are ready to download your resume and share the unique
            resume URL with your friends and family.
          </p>
          <div className="flex justify-between px-44 my-10 ">
            <button
              className="bg-[#9676E1] text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={HandleDownload}
            >
              Download
            </button>

            <RWebShare
              data={{
                text: "Hello Everyone, This is my resume, please open the URL to see it",
                url: `${window.location.origin}/resumes/view/${id}`,
                title: `${data?.personalInformation?.name} resume`,
              }}
              onClick={() => console.log("Shared successfully!")}
            >
              <button className="bg-[#9676E1] text-white px-4 py-2 rounded hover:bg-green-700">
                Share
              </button>
            </RWebShare>
          </div>
        </div>
      </div>

      <div className=" md:mx-70 lg:mx-36  flex justify-center items-center">
        <div style={{ minWidth: "800px" }}>
          <div id="print-area">
            <ResumePreview />
          </div>
        </div>
      </div>
    </DataContext.Provider>
  );
}

export default ViewResume;

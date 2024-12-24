import ResumePreview from "../EditResume/ResumePreview/index";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { RWebShare } from "react-web-share";
import { DataContext } from "@/context/DataContext";
import html2pdf from "html2pdf.js";

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
    const element = document.querySelector("#print-area");
    const opt = {
      filename: `${data?.personalInformation?.name || "resume"}.pdf`,
      image: { type: "jpeg", quality: 1 }, // Đặt chất lượng ảnh cao nhất
      html2canvas: { scale: 3, logging: true, letterRendering: true }, // Tăng scale và bật log để theo dõi chất lượng
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Tạo và tải file PDF
    html2pdf().from(element).set(opt).save();
  };

  return (
    <DataContext.Provider value={{ data, setData, id, access_token }}>
      <div className="min-h-screen">
        <div id="no-print" className="h-[20vh]">
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
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
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Share
                </button>
              </RWebShare>
            </div>
          </div>
        </div>
        <div className="md:mx-70 lg:mx-36 flex justify-center items-center tranform scale-75">
          <div id="print-area" className="w-[50%]">
            <div className="h-[118.5vh] overflow-auto">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </DataContext.Provider>
  );
}

export default ViewResume;

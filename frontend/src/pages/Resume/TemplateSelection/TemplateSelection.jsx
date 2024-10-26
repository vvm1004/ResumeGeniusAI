import React, { useEffect, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import { createRoot } from 'react-dom/client';

import Template1 from "../Template/Template1";
import Template2 from "../Template/Template2";
import Template3 from "../Template/Template3";
import Template5 from "../Template/Template5";
import Template4 from "../Template/Template4";
import Template6 from "../Template/Template6";

const TemplateSelection = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/template");
        setTemplates(response.data.data.result);
        await updateTemplates(response.data.data.result); // Cập nhật các template
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, []);

  // const updateTemplates = async (templates) => {
  //   try {
  //     await Promise.all(templates.map(template => {
  //       return generateImageAndSave(template);
  //     }));
  //     console.log("Templates updated successfully.");
  //   } catch (error) {
  //     console.error("Error updating templates:", error);
  //   }
  // };

  // const generateImageAndSave = async (template) => {
  //   let TemplateComponent;

  //   if (template.id === "1") {
  //     TemplateComponent = <Template1 />;
  //   } else if (template.id === "2") {
  //     TemplateComponent = <Template2 />;
  //   } else if (template.id === "3") {
  //     TemplateComponent = <Template3 />;
  //   } else if (template.id === "4") {
  //     TemplateComponent = <Template4 />;
  //   } else if (template.id === "5") {
  //     TemplateComponent = <Template5 />;
  //   } else if (template.id === "6") {
  //     TemplateComponent = <Template6 />;
  //   } else {
  //     return;
  //   }

    // Tạo một div tạm thời để render template
  //   const templateElement = document.createElement('div');
  //   document.body.appendChild(templateElement); // Thêm element vào body
  //   const root = createRoot(templateElement); // Sử dụng createRoot
  //   root.render(TemplateComponent); // Render component

  //   // Đợi một chút để đảm bảo render hoàn tất
  //   await new Promise(resolve => setTimeout(resolve, 100));

  //   const canvas = await html2canvas(templateElement, {
  //     width: 794,  // Chiều rộng tương ứng với 210mm trong pixels
  //     height: 1123, // Chiều cao tương ứng với 297mm trong pixels
  //     scale: 0.5 // Đảm bảo tỷ lệ 1:1Chiều cao của ảnh phù hợp với thẻ img
  //   });
  //   const imgData = canvas.toDataURL("image/png");
  //   try {
  //     const updatedData = {
  //       preview: imgData,
  //     };

  //     await axios.patch(`http://localhost:4000/api/templates/${template.id}`, updatedData);
  //   } catch (error) {
  //     console.error("Error saving image to server:", error);
  //   } finally {
  //     // Xóa element tạm thời sau khi hoàn tất
  //     root.unmount();
  //     document.body.removeChild(templateElement);
  //   }
  // };

  // Sử dụng các class của Tailwind CSS
  return (
    <div className="p-8">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-5">Select a Template</h2>
      <div className="grid grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className=" border-gray-300 overflow-hidden  transform transition duration-300 hover:scale-105 cursor-pointer"
            onClick={() => onSelectTemplate(template.id)}
          >
            <img
              className="w-44 h-60 object-cover border-2 rounded-md"
              src={template.preview}
              alt={template.name}
            />
            <p className="text-center font-semibold text-lg p-2">{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelection;

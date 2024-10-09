import React from "react";

// Đây là component TemplateSelection để hiển thị danh sách các template
const TemplateSelection = ({ onSelectTemplate }) => {
  // Giả sử bạn có 3 template khác nhau để hiển thị
  const templates = [
    { id: 1, name: "Template 1", preview: "preview1.png" },
    { id: 2, name: "Template 2", preview: "preview2.png" },
    { id: 3, name: "Template 3", preview: "preview3.png" }
  ];

  return (
    <div className="template-selection-container">
      <h2 className="text-center text-2xl mb-4">Select a Template</h2>
      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="template-card border p-4 rounded-lg hover:shadow-lg cursor-pointer"
            onClick={() => onSelectTemplate(template.id)} // Gọi hàm onSelectTemplate khi người dùng chọn template
          >
            <img
              src={template.preview}
              alt={template.name}
              className="w-full h-48 object-cover mb-2"
            />
            <p className="text-center font-semibold">{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelection;

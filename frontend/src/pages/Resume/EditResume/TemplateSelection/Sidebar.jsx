import React, { useContext, useState } from "react";
import { DataContext } from "@/context/DataContext";

const SidebarTemplates = () => {
  const { selectedTemplate, setSelectedTemplate, templates, setData } =
    useContext(DataContext);
  if (!templates || templates.length === 0) {
    return <div className="text-white">No templates available.</div>;
  }
  const ChooseTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    setData((prevData) => ({
      ...prevData,
      template: templateId,
    }));
  };
  return (
    <div className=" p-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-6">Templates</h2>
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template._id}
            className={"flex flex-col items-center justify-center"}
            onClick={() => ChooseTemplate(template._id)}
            tabIndex={0}
          >
            <h3 className=" text-white text-sm font-bold mb-2">
              {template.name}
            </h3>
            <img
              className={`rounded-lg cursor-pointer ${
                selectedTemplate === template._id
                  ? "border-2 border-blue-500 bg-gray-800"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              src={template.previewImage}
            />
            {selectedTemplate === template._id && (
              <div className="">
                <span className="text-white text-xs font-bold">✔</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarTemplates;

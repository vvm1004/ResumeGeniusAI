import React, { useState, useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import ResumePreview from "../ResumePreview";
import { DataContext } from "@/context/DataContext";
import { IoIosArrowBack } from "react-icons/io";

const EditorPage = () => {
  const {
    data,
    setData,
    id,
    access_token,
    toggleTemplateSelection,
    selectedTemplate,
    setSelectedTemplate,
    templates,
  } = useContext(DataContext);
  const colors = ["#1e3a8a", "#33FF57", "#3357FF", "#FF33A1"];
  const [customColor, setCustomColor] = useState("#000000");
  const [selectedColor, setSelectedColor] = useState();

  const saveCustomColor = () => {
    setData((prevData) => {
      const currentBackground = prevData.settings?.colors?.background || [];

      if (currentBackground.length >= 4) {
        currentBackground.shift();
      }

      return {
        ...prevData,
        settings: {
          ...prevData.settings,
          colors: {
            ...prevData.settings?.colors,
            background: [...currentBackground, customColor],
          },
        },
      };
    });
  };
  const onColorSelect = (color) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    setSelectedColor(color);
  };

  return (
    <DataContext.Provider
      value={{
        selectedColor,
        data,
        setData,
        templates,
        setSelectedTemplate,
        selectedTemplate,
      }}
    >
      <div>
        <div className="flex w-full bg-[#0f141e] justify-between items-center px-10 h-[5vh]">
          <button
            onClick={() => toggleTemplateSelection(false)}
            className="flex items-center text-white"
          >
            <IoIosArrowBack className="mr-2" />
            <span>Back to Editor</span>
          </button>
          <button className="grid grid-cols-5 gap-3 items-center">
            {colors.map((color, index) => (
              <div
                key={index}
                onClick={() => onColorSelect(color)}
                className={`h-5 w-5 rounded-full cursor-pointer border ${
                  selectedColor === color
                    ? "border-black"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              ></div>
            ))}

            <div>
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="h-5 w-5 rounded-full cursor-pointer "
                style={{ backgroundColor: customColor }}
              />
            </div>
          </button>
          <div>
            <button
              onClick={saveCustomColor}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save Color
            </button>
          </div>
        </div>

        <div className="flex h-[95vh] bg-gray-500">
          <div className="w-1/4 h-[95vh] bg-[#1e2532] p-4 border-r border-gray-300 overflow-auto">
            <Sidebar />
          </div>

          <div className="flex justify-center w-3/4 p-4 -translate-y-28">
            <div className="h-[120vh] w-[800px] transform scale-[0.7] overflow-auto  border-2 rounded-xl">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </DataContext.Provider>
  );
};

export default EditorPage;

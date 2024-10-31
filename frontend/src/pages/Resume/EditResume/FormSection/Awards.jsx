import { useContext, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { DataContext } from "@/context/DataContext";

function Awards() {
  const { data, setData } = useContext(DataContext);

  const handleUpdateAward = (index, updatedField) => {
    const updatedAwards = (data?.awards || [])?.map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, awards: updatedAwards });
  };

  const toggleAward = (index) => {
    if (data.awards && data.awards[index]) {
      handleUpdateAward(index, { isOpen: !data.awards[index].isOpen });
    }
  };

  const addAward = () => {
    const newAward = {
      title: "",
      issuer: "",
      date: "",
      description: "",
      isOpen: true,
    };
    setData({
      ...data,
      awards: [...(data?.awards || []), newAward],
    });
  };

  const removeAward = (index) => {
    setData((prevData) => {
      const updatedAwards = (prevData?.awards || []).filter((_, i) => i !== index);
      return { ...prevData, awards: updatedAwards };
    });
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8 mt-6 bg-white rounded-lg shadow-md">
        <div className="max-w-4xl mx-auto pb-0">
          <h2 className="text-2xl font-bold mb-2">Awards</h2>
          <div className="text-sm text-gray-500 mb-4">
            List your awards and recognitions. Include the award title, issuer, date, and a brief description.
          </div>
        </div>

        {data?.awards && data?.awards?.length > 0 ? (
          data?.awards?.map((item, index) => (
            <div
              key={index}
              className="award-history relative max-w-4xl mx-auto p-6 pt-0 bg-white rounded-lg shadow-md mt-6 group"
            >
              <button
                onClick={() => removeAward(index)}
                className="absolute top-4 right-4 text-red-500 hidden group-hover:block"
              >
                X
              </button>

              <div
                onClick={() => toggleAward(index)}
                className="cursor-pointer mb-4"
              >
                <h3 className="text-lg font-semibold">
                  {item?.title || "(No title specified)"}{" "}
                  {item?.issuer ? `by ${item?.issuer}` : ""}
                </h3>
                <div className="text-gray-500">{item?.date || ""}</div>
              </div>

              {item.isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Award Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item?.title}
                      onChange={(e) =>
                        handleUpdateAward(index, { title: e.target.value })
                      }
                    />
                  </div>

                  {/* Issuer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Issuer
                    </label>
                    <input
                      type="text"
                      name="issuer"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item?.issuer}
                      onChange={(e) =>
                        handleUpdateAward(index, { issuer: e.target.value })
                      }
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="year"
                      name="date"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item?.date}
                      onChange={(e) =>
                        handleUpdateAward(index, { date: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              {item.isOpen && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <Editor
                    apiKey={`${import.meta.env.EDITOR}`}
                    init={{
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                      ],
                      toolbar:
                        "formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
                    }}
                    value={item?.description || ""}
                    onEditorChange={(content) =>
                      handleUpdateAward(index, { description: content })
                    }
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No awards available.</p>
        )}

        <div className="max-w-4xl mx-auto p-6 pb-0 ml-2">
          <button
            className="text-blue-600 text-sm"
            onClick={addAward}
          >
            + Add one more award
          </button>
        </div>
      </div>
    </>
  );
}

export default Awards;

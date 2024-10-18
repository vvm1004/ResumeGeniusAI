import { DataContext } from "@/context/DataContext";
import { Editor } from "@tinymce/tinymce-react";
import { useContext } from "react";

function Projects() {
  const { data, setData } = useContext(DataContext);

  const handleUpdateProjects = (index, updatedField) => {
    const updatedProject = (data?.projects || [])?.map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, projects: updatedProject });
  };

  const toggleProjects = (index) => {
    handleUpdateProjects(index, { isOpen: !data.projects[index].isOpen });
  };

  const addNewProject = () => {
    const newProject = {
      title: "",
      description: "",
      features: "",
      technologies: "",
      demo: "",
      githubLink: "",
      date: "",
      tool: "",
      isOpen: true,
    };
    setData({
      ...data,
      projects: [...(data?.projects || []), newProject],
    });
  };

  const removeProjects = (index) => {
    const updatedProject = (data?.projects || []).filter((_, i) => i !== index);
    setData({ ...data, projects: updatedProject });
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8 mt-6 bg-white rounded-lg shadow-md">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Projects</h2>
          <div className="text-sm text-gray-500 mb-4">
            Share projects you've worked on that you're proud of! These can be
            personal, collaborative, or work projects. Don't forget to include
            links to websites, source code, or related documentation so others
            can learn more about them.
          </div>
        </div>

        {data?.projects && data?.projects?.length > 0 ? (
          data?.projects?.map((item, index) => (
            <div
              key={index}
              className="relative max-w-4xl mx-auto p-6 pt-0 bg-white rounded-lg shadow-md mt-6 group"
            >
              <button
                onClick={() => removeProjects(index)}
                className="absolute top-4 right-4 text-red-500 hidden group-hover:block"
              >
                X
              </button>

              <div
                onClick={() => toggleProjects(index)}
                className="cursor-pointer mb-4"
              >
                <h3 className="text-lg font-semibold">
                  {item?.title || "(No specified)"}{" "}
                </h3>
                {item?.githubLink ? item?.githubLink : ""}
                <h2></h2>
              </div>

              {item.isOpen && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item?.title}
                      onChange={(e) =>
                        handleUpdateProjects(index, { title: e.target.value })
                      }
                    />
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Technologies
                    </label>
                    <input
                      type="text"
                      name="technologies"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item?.technologies}
                      onChange={(e) =>
                        handleUpdateProjects(index, {
                          technologies: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Link */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Link (Github, Website,...)
                    </label>
                    <input
                      type="text"
                      name="githubLink"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={item?.githubLink}
                      onChange={(e) =>
                        handleUpdateProjects(index, {
                          githubLink: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <Editor
                      apiKey="olzjmmt7ltp5nziuyldtd4pqrcecf9hsvutq9aj2noaesmqz"
                      init={{
                        menubar: false,
                        plugins: [
                          "advlist autolink lists link image charmap print preview anchor",
                          "searchreplace visualblocks code fullscreen",
                          "insertdatetime media table paste code help wordcount",
                        ],
                        toolbar:
                          "formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | customButton",
                        setup: (editor) => {
                          editor.ui.registry.addButton("customButton", {
                            text: "AI pre-written phrases +",
                            onAction: () => {
                              alert("Feature coming soon!");
                            },
                            classes: "rounded-lg font-bold text-blue-500",
                          });
                        },
                      }}
                      value={item?.description || ""}
                      onEditorChange={(content) =>
                        handleUpdateProjects(index, { description: content })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No websites or social links available.
          </p>
        )}

        <div className="max-w-4xl mx-auto p-6 pb-0 ml-2">
          <button className="text-blue-600 text-sm" onClick={addNewProject}>
            + Add one more website or social link
          </button>
        </div>
      </div>
    </>
  );
}

export default Projects;

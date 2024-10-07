import { useContext } from "react";
import { DataContext } from "../../../context/DataContext";

function WebsitesAndSocialLinks() {
  const { data, setData } = useContext(DataContext);

  const handleUpdateWebsite = (index, updatedField) => {
    const updatedWebsites = (data.website || []).map((item, i) =>
      i === index ? { ...item, ...updatedField } : item
    );
    setData({ ...data, website: updatedWebsites });
  };

  const toggleWebsite = (index) => {
    handleUpdateWebsite(index, { isOpen: !data.website[index].isOpen });
  };

  const addWebsite = () => {
    const newWebsite = {
      title: "",
      link: "",
      isOpen: true,
    };
    setData({
      ...data,
      website: [...(data.website || []), newWebsite],
    });
  };

  const removeWebsite = (index) => {
    const updatedWebsites = (data.website || []).filter((_, i) => i !== index);
    setData({ ...data, website: updatedWebsites });
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2">Websites & Social Links</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add links to websites you want hiring managers to see! Perhaps it will
          be a link to your portfolio, LinkedIn profile, or personal website.
        </p>
      </div>

      {data.website && data.website.length > 0 ? (
        data.website.map((item, index) => (
          <div
            key={index}
            className="website relative max-w-4xl mx-auto p-6 pt-0 bg-white rounded-lg shadow-md mt-6 group"
          >
            <button
              onClick={() => removeWebsite(index)}
              className="absolute top-4 right-4 text-red-500 hidden group-hover:block"
            >
              X
            </button>

            <div
              onClick={() => toggleWebsite(index)}
              className="cursor-pointer mb-4"
            >
              <h3 className="text-lg font-semibold">
                {item.title || "(No specified)"}{" "}
              </h3>
              {item.link ? item.link : ""}
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
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item.title}
                    onChange={(e) =>
                      handleUpdateWebsite(index, { title: e.target.value })
                    }
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Link
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item.link}
                    onChange={(e) =>
                      handleUpdateWebsite(index, { link: e.target.value })
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
        <button className="text-blue-600 text-sm" onClick={addWebsite}>
          + Add one more website or social link
        </button>
      </div>
    </>
  );
}

export default WebsitesAndSocialLinks;

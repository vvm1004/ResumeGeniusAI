import { useContext } from "react";
import { DataContext } from "../../../context/DataContext";

function WebsitesAndSocialLinksPreview() {
  const { data } = useContext(DataContext);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Websites & Social Links</h2>

      {data?.website && data.website.length > 0 ? (
        data.website.map((item, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-bold">
              {item.title || "(No specified title)"}
            </h3>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {item.link}
              </a>
            )}
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No websites or social links available.</p>
      )}
    </div>
  );
}

export default WebsitesAndSocialLinksPreview;

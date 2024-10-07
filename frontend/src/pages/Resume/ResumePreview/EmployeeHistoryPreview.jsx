import { useContext } from "react";
import { DataContext } from "../../../context/DataContext";

function EmploymentHistoryPreview() {
  const { data } = useContext(DataContext); 

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Employment History</h2>

        {data?.experience && data.experience.length > 0 ? (
          data.experience.map((item, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-bold">
                {item.title} at {item.companyName}, {item.city}
              </h3>
              <div className="text-sm text-gray-600">
                {formatMonthYear(item.startDate)}—{formatMonthYear(item.endDate)}
              </div>
              {item.description && (
                <div 
                  className="mt-2 text-gray-700" 
                  dangerouslySetInnerHTML={{ __html: item.description }} // Hiển thị nội dung với HTML
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No employment history available.</p>
        )}
      </div>
    </>
  );
}

function formatMonthYear(monthYear) {
  if (!monthYear) return ""; 
  const [year, month] = monthYear.split("-");
  const date = new Date(year, month - 1); 
  const options = { year: "numeric", month: "short" };
  return date.toLocaleDateString("en-US", options); 
}

export default EmploymentHistoryPreview;

import { useContext } from "react";
import { DataContext } from "../../../context/DataContext";

function PersonalDetailPreview() {
  const { data } = useContext(DataContext);

  return (
    <>
      <div className="flex justify-between mb-6">
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-4xl font-bold">{data?.jobTitle}</h1>
            <div className="text-xl text-gray-500">
              {data?.firstName} {data?.lastName}
            </div>
          </div>
          <div className="text-gray-700">
            <div>{data?.email}</div>
            <div>{data?.phone}</div>
            <div>
              {data?.city} {data?.country}
            </div>
          </div>
        </div>

        {data?.image && (
          <div className="w-32 h-32 overflow-hidden">
            <img
              className="object-cover w-full h-full"
              src={data.image}
              alt="Uploaded image"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default PersonalDetailPreview;

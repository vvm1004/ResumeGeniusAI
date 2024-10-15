import React from "react";

function Template1({ data }) {
  return (
    <div className="flex h-full">
      <div className="w-1/3 h-full bg-gray-200 p-4">
        <h2 className="text-2xl font-bold text-gray-900 border-b-2 mb-4 border-b-red-500">
          Personal Details
        </h2>
        <div className="">
          <div className="text-lg font-bold text-gray-900">
            {data?.personalInformation?.name}
          </div>
          <div className="text-sm text-gray-600">
            {data?.personalInformation?.email}
          </div>
          <div className="text-sm text-gray-600">
            {data?.personalInformation?.phone}
          </div>
          <div className="text-sm text-gray-600">
            {data?.personalInformation?.github}
          </div>
          <div className="text-sm text-gray-600">
            {data?.personalInformation?.address}
          </div>
        </div>
      </div>
      <div className="w-2/3 h-full p-4">
        <div className="">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 mb-2 border-b-red-500">
            Profile
          </h2>
          <div className="text-lg text-gray-900" dangerouslySetInnerHTML={{ __html: data?.summary}}>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Template1;

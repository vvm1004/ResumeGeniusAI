import { DataContext } from "../../../context/DataContext";
import { useContext, useState } from "react";

function PersonalDetail() {
  const { data, setData } = useContext(DataContext); // Thêm setData để cập nhật data
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [selectedImage, setSelectedImage] = useState(data.image || null); // Khởi tạo với data.image nếu có

  const handleAddMoreDetails = () => {
    setShowMoreDetails(!showMoreDetails);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setData({ ...data, image: imageUrl }); // Lưu URL của ảnh vào data
    }
  };

  const handleDelete = () => {
    setSelectedImage(null);
    setData({ ...data, image: null }); // Xóa URL ảnh trong data
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value, // Cập nhật giá trị mới cho trường tương ứng
    });
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Personal details</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              type="text"
              name="jobTitle"
              value={data.jobTitle}
              onChange={handleChange} // Cập nhật khi có thay đổi
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div>

          {/* Upload Photo */}
          <div className="flex items-center ml-6">
            <div className="h-14 w-14 bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer" onClick={triggerFileInput}>
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 1112 0H4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>

            {selectedImage ? (
              <div className="ml-4 flex flex-col space-y-2">
                <button
                  className="text-sm text-blue-600"
                  onClick={triggerFileInput}
                >
                  Edit
                </button>
                <button
                  className="text-sm text-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            ) : (
              <div className="ml-4">
                <label
                  className="text-sm text-blue-600 cursor-pointer"
                  onClick={triggerFileInput}
                >
                  Upload photo
                </label>
              </div>
            )}

            {/* Hidden file input */}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={data.firstName}
              onChange={handleChange} // Cập nhật khi có thay đổi
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={data.lastName}
              onChange={handleChange} // Cập nhật khi có thay đổi
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange} // Cập nhật khi có thay đổi
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleChange} // Cập nhật khi có thay đổi
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={data.country}
              onChange={handleChange} // Cập nhật khi có thay đổi
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              value={data.city}
              onChange={handleChange} // Cập nhật khi có thay đổi
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div>

          {showMoreDetails && (
            <>
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={data.address}
                  onChange={handleChange} // Cập nhật khi có thay đổi
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={data.postalCode}
                  onChange={handleChange} // Cập nhật khi có thay đổi
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                />
              </div>
            </>
          )}

          {/* Add more details */}
          <div>
            <a
              href="#"
              className="text-blue-600 text-sm"
              onClick={handleAddMoreDetails}
            >
              {showMoreDetails ? "Hide additional details" : "Add more detail"}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default PersonalDetail;

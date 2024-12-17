import { DataContext } from "@/context/DataContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  MdDeleteOutline,
  MdExpandLess,
  MdExpandMore,
  MdOutlineModeEdit,
} from "react-icons/md";

const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
    />
  </div>
);

function PersonalDetail() {
  const { data, setData, access_token } = useContext(DataContext);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(
  //   data?.personalInformation?.image || null
  // );
  const [uploading, setUploading] = useState(false);

  // useEffect(() => {
  //   if (data?.personalInformation?.image && !selectedImage) {
  //     setSelectedImage(data.personalInformation.image);
  //   }
  // }, [data?.personalInformation?.image, selectedImage]);

  const handleAddMoreDetails = () => {
    setShowMoreDetails(!showMoreDetails);
  };
  // const handleImageChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setUploading(true);
  //     const formData = new FormData();
  //     formData.append("fileUpload", file);

  //     const headers = {
  //       "Content-Type": "multipart/form-data",
  //       folder_type: "image_personal_details",
  //       Authorization: `Bearer ${access_token}`,
  //     };

  //     try {
  //       const response = await axios.post(
  //         "http://localhost:8000/api/v1/files/upload",
  //         formData,
  //         {
  //           headers,
  //         }
  //       );

  //       const imageUrl = response.data.data.fileName;

  //       setSelectedImage(imageUrl);
  //       setData((prev) => ({
  //         ...prev,
  //         personalInformation: { ...prev.personalInformation, image: imageUrl },
  //       }));
  //     } catch (error) {
  //       console.error("Error uploading image:", error);
  //     } finally {
  //       setUploading(false);
  //     }
  //   }
  // }
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setUploading(true);
      //Đoạn này giảm dung lượng ảnh đừng care
      try {
        // Convert the image to Base64
        const base64Image = await convertToBase64(file);
        console.log("base64Image", base64Image);

        // Compress and resize to target below 50KB
        const compressedImage = await resizeAndCompressImage(base64Image, 50);
        console.log("compressedImage", compressedImage);
        // Set the compressed image and update data
        // setSelectedImage(compressedImage);
        setData((prev) => ({
          ...prev,
          personalInformation: {
            ...prev.personalInformation,
            image: compressedImage,
          },
        }));
      } catch (error) {
        console.error("Error processing image:", error);
      } finally {
        setUploading(false);
      }
    } else {
      console.error("File is not an image or no file selected.");
    }
  };

  // Convert image file to Base64 string
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Resize and compress the image
  const resizeAndCompressImage = (
    base64Image,
    maxSizeKB = 50, // Set to 50 KB target size
    maxWidth = 400, // Slightly reduce dimensions for better compression
    maxHeight = 400
  ) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64Image;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        // Scale down if larger than max dimensions
        if (width > maxWidth || height > maxHeight) {
          const scaleFactor = Math.min(maxWidth / width, maxHeight / height);
          width = width * scaleFactor;
          height = height * scaleFactor;
        }

        // Set canvas size and draw image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Compression function
        const tryCompress = (quality) => {
          const compressedImage = canvas.toDataURL("image/jpeg", quality);
          const imageSizeInKB = (compressedImage.length * 3) / 4 / 1024;

          if (imageSizeInKB <= maxSizeKB) {
            resolve(compressedImage); // Image is within target size
          } else if (quality > 0.1) {
            tryCompress(quality - 0.1); // Reduce quality if needed
          } else {
            resolve(compressedImage); // Return lowest quality if necessary
          }
        };

        // Start compression with an initial quality of 0.7 for faster results
        tryCompress(0.7);
      };

      img.onerror = reject;
    });
  };

  const handleDeleteImage = () => {
    // setSelectedImage(null);
    setData((prev) => ({
      ...prev,
      personalInformation: {
        ...prev.personalInformation,
        image: "",
      },
    }));
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        personalInformation: {
          ...prev.personalInformation,
          [name]: value,
        },
      }));
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Personal details</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={data?.title}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div> */}
          <InputField
            label="Job Title"
            name="title"
            value={data?.title}
            onChange={handleChange}
          />

          {/* Upload Photo */}
          <div className="flex items-center ml-6">
            <div
              className="h-14 w-14 bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={triggerFileInput}
            >
              {data?.personalInformation?.image ? (
                <img
                  src={data?.personalInformation?.image}
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

            {data?.personalInformation?.image ? (
              <div className="ml-4 flex flex-col space-y-2">
                <button
                  className="flex items-center text-md text-blue-600 hover:text-gray-600"
                  onClick={triggerFileInput}
                >
                  <span className="mr-2">
                    <MdOutlineModeEdit size={20} />
                  </span>
                  Edit photo
                </button>
                <button
                  className="flex items-center text-md text-gray-600 hover:text-red-600"
                  onClick={handleDeleteImage}
                >
                  <span className="mr-2">
                    <MdDeleteOutline size={20} />
                  </span>
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

          <InputField
            label="Name"
            name="name"
            value={data?.personalInformation?.name}
            onChange={handleChange}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={data?.personalInformation?.email}
            onChange={handleChange}
          />
          <InputField
            label="Address"
            name="address"
            value={data?.personalInformation?.address}
            onChange={handleChange}
          />
          <InputField
            label="Phone"
            name="phone"
            value={data?.personalInformation?.phone}
            onChange={handleChange}
          />

          {/* Name */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={data?.personalInformation?.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div> */}

          {/* Email */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={data?.personalInformation?.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div> */}

          {/* Address */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={data?.personalInformation?.address}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div> */}

          {/* Phone */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={data?.personalInformation?.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div> */}

          {showMoreDetails && (
            <>
              <InputField
                label="Github"
                name="github"
                value={data?.personalInformation?.github}
                onChange={handleChange}
              />
              <InputField
                label="Linkedin"
                name="linkedin"
                value={data?.personalInformation?.linkedin}
                onChange={handleChange}
              />

              {/* Github */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  Github
                </label>
                <input
                  type="text"
                  name="github"
                  value={data?.personalInformation?.github}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                />
              </div> */}

              {/* Linkedin */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  Linkedin
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={data?.personalInformation?.linkedin}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                />
              </div> */}
            </>
          )}

          {/* Add more details */}
          <div>
            <a
              href="#"
              className="text-blue-600 text-sm"
              onClick={handleAddMoreDetails}
            >
              {showMoreDetails ? (
                <div className="flex justify-left items-center">
                  <span>Hide additional details</span>
                  <MdExpandLess className="text-xl" />
                </div>
              ) : (
                <div className="flex justify-left items-center">
                  <span>Add more detail</span>
                  <MdExpandMore className="text-xl" />
                </div>
              )}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default PersonalDetail;

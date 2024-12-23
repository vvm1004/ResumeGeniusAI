import { Button, Card, Form, Input, Select, Tabs, Upload } from "antd";
import { useSelector } from "react-redux";
import "./index.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { notification } from "antd";
import { callUpdateUser } from "@/config/api";
import { UploadOutlined } from "@ant-design/icons";

const AccountManagement = () => {
  const userId = useSelector((state) => state.account.user._id);
  const access_token = localStorage.getItem("access_token");

  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/${userId}`
      );
      setData(response.data.data);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const openNotification = (type, message) => {
    notification[type]({
      message: message,
      duration: 3,
      placement: "topRight",
    });
  };

  const renderInformation = () => {
    // console.log("sldjfklsdjfks", data);
    return (
      <>
        <div className="flex">
          <div
            className="w-2/3 font-bold text-gray-600"
            style={{ fontSize: "17px" }}
          >
            <div>
              ID: <span className="ml-2 font-normal">{data._id}</span>
            </div>
            <div className="mt-2">
              User name: <span className="ml-2 font-normal">{data.name}</span>
            </div>
            <div className="mt-2">
              Email: <span className="ml-2 font-normal">{data.email}</span>
            </div>
            <div className="mt-2">
              Age: <span className="ml-2 font-normal">{data.age}</span>
            </div>
            <div className="mt-2">
              Gender: <span className="ml-2 font-normal">{data.gender}</span>
            </div>
            <div className="mt-2">
              Address: <span className="ml-2 font-normal">{data.address}</span>
            </div>
            <div className="mt-2">
              Company name:{" "}
              <span className="ml-2 font-normal">{data?.company?.name}</span>
            </div>
          </div>
          <div className="w-1/3">
            <div
              className="mb-2 font-bold text-gray-600"
              style={{ fontSize: "17px" }}
            >
              Avatar:{" "}
            </div>
            <img
              className="rounded-sm w-32 h-auto border"
              src={
                data?.avatar
                  ? data?.avatar
                  : `${
                      import.meta.env.VITE_BACKEND_URL
                    }/images/avatar_user/avatar-default.jpg`
              }
              alt="Avatar"
            />
          </div>
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "1":
        return renderChangeInformation();
      case "2":
        return renderChangePassword();
      default:
        return null;
    }
  };

  const renderChangeInformation = () => {
    if (data) {
      form.setFieldsValue({
        _id: data._id,
        name: data.name,
        email: data.email,
        age: data.age,
        gender: data.gender,
        address: data.address,
      });
    }

    const handleImageChange = async (file) => {
      if (file && file.type.startsWith("image/")) {
        try {
          const base64Image = await convertToBase64(file);

          const compressedImage = await resizeAndCompressImage(base64Image, 50);

          form.setFieldsValue({ avatar: compressedImage });

          setData((prev) => ({
            ...prev,
            avatar: compressedImage,
          }));
        } catch (error) {
          console.error("Error processing image:", error);
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

    const handleFormSubmit = async (values) => {
      try {
        // console.log("Submitted values", values);
        const response = await callUpdateUser(values);
        openNotification("success", "User information updated successfully!");
        await fetchData();
      } catch (error) {
        openNotification("error", "Error updating user information!");
      }
    };

    return (
      <Form
        className="p-4 pt-0"
        form={form}
        layout="horizontal"
        onFinish={handleFormSubmit}
      >
        <div className="flex items-center">
          <div className="w-2/3">
            <Form.Item
              label={<span className="font-bold">ID</span>}
              name="_id"
              rules={[{ required: true }]}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
            >
              <Input className="bg-gray-100" readOnly />
            </Form.Item>
            <Form.Item
              label={<span className="font-bold">Name</span>}
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>
            <Form.Item
              label={<span className="font-bold">Email</span>}
              name="email"
              rules={[{ required: true }]}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
            >
              <Input className="bg-gray-100" readOnly />
            </Form.Item>
          </div>
          <div className="w-1/3">
            <Form.Item
              label={<span className="font-bold">Avatar</span>}
              name="avatar"
              rules={[{ required: true, message: "Please upload an avatar!" }]}
              // labelCol={{ span: 3 }}
              // wrapperCol={{ span: 10 }}
              labelAlign="top"
            >
              <img
                className="mb-2 rounded-sm w-32 h-auto border"
                src={
                  data?.avatar
                    ? data?.avatar
                    : `${
                        import.meta.env.VITE_BACKEND_URL
                      }/images/avatar_user/avatar-default.jpg`
                }
                alt="Avatar"
              />
              <Upload
                name="avatar"
                listType="picture"
                maxCount={1}
                accept="image/*"
                beforeUpload={(file) => {
                  handleImageChange(file);
                  return false;
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </div>
        </div>
        <Form.Item
          label={<span className="font-bold">Age</span>}
          name="age"
          rules={[
            { required: true, message: "Please enter your age" },
            // { type: "number", message: "Age must be a number" },
          ]}
          labelCol={{ span: 3 }}
        >
          <Input type="number" placeholder="Enter your age" />
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Gender</span>}
          name="gender"
          rules={[{ required: true, message: "Please select your gender" }]}
          labelCol={{ span: 3 }}
        >
          <Select placeholder="Select your gender">
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Address</span>}
          name="address"
          rules={[{ required: true, message: "Please enter your address" }]}
          labelCol={{ span: 3 }}
        >
          <Input placeholder="Enter your address" />
        </Form.Item>
        <Form.Item className="text-right">
          <button
            type="submit"
            className="bg-blue-500 font-semibold text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </Form.Item>
      </Form>
    );
  };

  const renderChangePassword = () => {
    const handlePasswordChange = async (values) => {
      const { oldPassword, newPassword, confirmPassword } = values;

      if (newPassword !== confirmPassword) {
        openNotification(
          "error",
          "New password and confirm password do not match!"
        );
        return;
      }

      try {
        // console.log("valueeeeeee passs", values);
        const response = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/change-password`,
          values,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        openNotification("success", "Password changed successfully!");
        form.resetFields();
      } catch (error) {
        openNotification("error", "Error changing password!");
      }
    };

    return (
      <Form
        form={form}
        onFinish={handlePasswordChange}
        layout="horizontal"
        className="p-4 pt-0"
      >
        <Form.Item
          label={<span className="font-bold">Current Password</span>}
          name="oldPassword"
          rules={[
            { required: true, message: "Please enter your current password" },
          ]}
          labelCol={{ span: 5 }}
        >
          <Input.Password
            placeholder="Enter your current password"
            size="small"
          />
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">New Password</span>}
          name="newPassword"
          rules={[
            { required: true, message: "Please enter your new password" },
            {
              min: 6,
              message: "Password must be at least 6 characters",
            },
          ]}
          labelCol={{ span: 5 }}
        >
          <Input.Password placeholder="Enter your new password" size="small" />
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Confirm New Password</span>}
          name="confirmPassword"
          rules={[
            { required: true, message: "Please confirm your new password" },
          ]}
          labelCol={{ span: 7 }}
        >
          <Input.Password
            placeholder="Confirm your new password"
            size="small"
          />
        </Form.Item>
        <Form.Item className="text-right">
          <button
            type="submit"
            className="bg-blue-500 font-semibold text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Change Password
          </button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <>
      <div className="p-8">
        <h2 className="text-blue-600 text-3xl font-bold">Account Management</h2>
        <div className="mt-4 flex">
          <Card
            title="Profile Details"
            bordered={true}
            style={{
              marginRight: "20px",
              width: "40%",
              height: "100%",
              borderColor: "#1d4ed8",
              borderWidth: 2,
              borderRadius: 8,
            }}
            headStyle={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#1d4ed8",
              borderBottom: "2px solid #1d4ed8",
            }}
          >
            {renderInformation()}
          </Card>
          <Card
            className="change-profile"
            bordered={true}
            style={{
              height: "100%",
              borderColor: "#1d4ed8",
              borderWidth: 2,
              borderRadius: 8,
              flex: 1,
            }}
          >
            {/* Custom Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "2px solid #1d4ed8",
                marginBottom: "16px",
              }}
            >
              <div
                onClick={() => setActiveTab("1")}
                style={{
                  flex: 1,
                  fontSize: "20px",
                  textAlign: "center",
                  padding: "10px",
                  cursor: "pointer",
                  color: activeTab === "1" ? "#1d4ed8" : "gray",
                  fontWeight: "bold",
                  borderRight: "2px solid #1d4ed8",
                }}
              >
                Change Information
              </div>
              <div
                onClick={() => setActiveTab("2")}
                style={{
                  flex: 1,
                  fontSize: "20px",
                  textAlign: "center",
                  padding: "10px",
                  cursor: "pointer",
                  color: activeTab === "2" ? "#1d4ed8" : "gray",
                  fontWeight: "bold",
                }}
              >
                Change Password
              </div>
            </div>

            {/* Card Body */}
            {renderContent()}
          </Card>
        </div>
      </div>
    </>
  );
};

export default AccountManagement;

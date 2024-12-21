import { Card, Form, Input, Select, Tabs } from "antd";
import { useSelector } from "react-redux";
import "./index.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { notification } from "antd";
import { callUpdateUser } from "@/config/api";

const AccountManagement = () => {
  const userId = useSelector((state) => state.account.user._id);
  const access_token = localStorage.getItem("access_token");

  console.log("acceskdlfjksdjfl", access_token);

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
    console.log("sldjfklsdjfks", data);
    return (
      <>
        <div className="font-bold text-gray-600" style={{ fontSize: "17px" }}>
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
            Company name: <span className="ml-2 font-normal">{data?.company?.name}</span>
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

    const handleFormSubmit = async (values) => {
      try {
        // console.log("valueeeeeddddddddddddđ", values);
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
        <Form.Item
          label={<span className="font-bold">ID</span>}
          name="_id"
          rules={[{ required: true }]}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 10 }}
        >
          <Input className="bg-gray-100" readOnly />
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Name</span>}
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
          labelCol={{ span: 3 }}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Email</span>}
          name="email"
          rules={[{ required: true }]}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 10 }}
        >
          <Input className="bg-gray-100" readOnly />
        </Form.Item>
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
        console.log("valueeeeeee passs", values);
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

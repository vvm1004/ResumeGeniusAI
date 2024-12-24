import React, { useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  notification,
  Spin,
  Col,
  Row,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { DebounceSelect } from "@/components/admin/user/debouce.select"; // Import the DebounceSelect component
import { callFetchCompany } from "@/config/api"; // Assuming you have this API call available
import "./hr_register.css"; // Use custom CSS for styling
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirecting

// Interface for the company select
export interface ICompanySelect {
  label: string;
  value: string;
  key?: string;
}

const HrRegister = () => {
  const navigate = useNavigate(); // Hook to handle redirection

  const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/hr-registration/";
  const token = localStorage.getItem("access_token");
  const user = useSelector((state: any) => state.account.user);

  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<ICompanySelect[]>([]);

  // Function to fetch companies based on the query string
  async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
    const res = await callFetchCompany(
      `current=1&pageSize=100&name=/${name}/i`
    );
    console.log("resssL: ", companies)
    if (res && res.data) {
      const list = res.data.result;
      return list.map((item) => ({
        label: item.name as string,
        value: item._id as string,
      }));
    } else {
      return [];
    }
  }
  const termsRef = useRef<HTMLDivElement | null>(null);

  // Handle form submission
  const onFinish = async (values: any) => {
    setLoading(true); // Show loading spinner

    // Prepare the data object to send to the API
    const registrationData = {
      email: values.email,
      fullName: values.username,
      phone: values.phone,
      address: values.address,
      status: "pending",
      age: values.age,
      gender: values.gender,
      company: {
        _id: values.company.value,
        name: values.company.label,
      },

    };

    try {

      const response = await axios.post(API_URL, registrationData, {
        headers: {
          Authorization: `Bearer ${token}`,  // Add the token to the Authorization header
        },
      });

      if (response.data.data.success) {
        notification.success({
          message: "Registration Successful!",
          description: "You have successfully registered as an HR.",
        });

        // Redirect to a thank you page after successful registration
        navigate("/thank-you-register"); // You can replace this with another route if needed
      } else {
        notification.error({
          message: "Registration Failed",
          description:
            response.data.message ||
            "Something went wrong during registration.",
        });
      }
    } catch (error) {
      console.error("API Error:", error); // For debugging
      notification.error({
        message: "API Error",
        description:
          "There was an error connecting to the server. Please try again later.",
      });
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };


  // Function to scroll to the Terms and Conditions section
  const scrollToTerms = () => {
    if (termsRef.current) {
      termsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="register-container">
      {/* Terms and Conditions Section at the top */}
      <div className="terms-content" ref={termsRef}>
        <h2>Terms and Conditions</h2>
        <p>
          Welcome to our platform! By registering as an HR, you agree to the
          following terms and conditions:
        </p>
        <ul>
          <li>
            1. You must provide accurate and truthful information when
            registering.
          </li>
          <li>
            2. You are prohibited from using our services for any illegal
            activities.
          </li>
          <li>
            3. We reserve the right to modify or update these terms at any time.
            All changes will be communicated via email or a notice on the
            platform.
          </li>
          <li>
            4. All information you provide will be kept confidential and will
            not be shared with third parties without your consent.
          </li>
          <li>
            5. You are responsible for ensuring the accuracy of the information
            in your HR profile.
          </li>
          <li>
            6. You may request the deletion of your account at any time by
            contacting our support team.
          </li>
          <li>
            7. The platform reserves the right to suspend or terminate your
            account in case of any violation of these terms or the platform's
            community guidelines.
          </li>
          <li>
            8. You agree not to engage in any activity that could harm the
            platform or disrupt other users' access.
          </li>
          <li>
            9. You acknowledge that the platform is not responsible for any data
            loss, system downtime, or damages arising from using the service.
          </li>
          <li>
            10. You agree to abide by all local and international laws when
            using the platform, including but not limited to privacy laws,
            intellectual property laws, and labor laws.
          </li>
          <li>
            11. You acknowledge that you have read, understood, and agree to the
            platform's privacy policy, which outlines how your personal data
            will be handled.
          </li>
          <li>
            12. All content you post must comply with our community guidelines.
            We prohibit any form of hate speech, discrimination, harassment, or
            illegal content.
          </li>
          <li>
            13. The platform may change or discontinue any service or feature
            without prior notice. We will notify you of any major changes that
            could impact your experience.
          </li>
          <li>
            14. You understand that the platform may have restrictions for
            certain countries or regions. Access to the platform may be limited
            or blocked based on geographic location.
          </li>
          <li>
            15. You may not transfer or assign your account to another person or
            entity without prior written consent from the platform.
          </li>
          <li>
            16. The platform reserves the right to take legal action against
            users who violate the terms and conditions or who engage in
            fraudulent activities.
          </li>
          <li>
            17. You are responsible for maintaining the confidentiality of your
            login credentials, and you agree to notify the platform immediately
            in case of any unauthorized use of your account.
          </li>
          <li>
            18. You agree not to engage in spamming or send unsolicited
            marketing materials through the platform's messaging system.
          </li>
          <li>
            19. In the event of a dispute, you agree to resolve the matter
            through arbitration or mediation as outlined in our dispute
            resolution process.
          </li>
          <li>
            20. These terms and conditions are governed by the laws of the
            country in which the platform operates, and any disputes will be
            subject to the exclusive jurisdiction of the courts in that country.
          </li>
        </ul>
        <p>
          We hope you enjoy using our service and find success in your HR
          activities! If you have any questions, feel free to contact us.
        </p>
      </div>

      {/* Registration Form */}
      <div className="form-container mb-4 rounded-md">
        <h3 className="title p-2 rounded-md">Register to Become an HR</h3>
        <Spin spinning={loading} tip="Registering...">
          <Form
            name="hr_register"
            className="register-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            {/* Full Name */}
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please enter your full name!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Full Name" />
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "Please enter a valid phone!" },
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Phone" />
            </Form.Item>
            <Form.Item
              name="address"
              rules={[
                { required: true, message: "Please enter a valid address!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Address" />
            </Form.Item>
            <Form.Item
              name="age"
              rules={[{ required: true, message: "Please enter your age!" }]}
            >
              <Input
                type="number"
                placeholder="Age"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              rules={[{ required: true, message: "Please select your gender!" }]}
            >
              <Input placeholder="Gender" />
            </Form.Item>

            {/* Email */}
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter a valid email!",
                  type: "email",
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            {/* Company Selection */}
            <Form.Item
              name="company"
              label=""
              rules={[{ required: true, message: "Please select a company!" }]}
            >
              <DebounceSelect
                allowClear
                showSearch
                value={companies}
                placeholder="Select Company"
                fetchOptions={fetchCompanyList}
                onChange={(newValue: any) => {
                  // Handle both single and multiple selections
                  if (Array.isArray(newValue)) {
                    setCompanies(newValue);
                  } else {
                    setCompanies([newValue]);
                  }
                }}
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* Terms and Conditions Checkbox */}
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                        "You must agree to the terms and conditions!"
                      ),
                },
              ]}
            >
              <Checkbox>
                I agree to the{" "}
                <a href="#terms" onClick={scrollToTerms}>
                  Terms and Conditions
                </a>
              </Checkbox>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
              >
                Register
              </Button>
            </Form.Item>

          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default HrRegister;

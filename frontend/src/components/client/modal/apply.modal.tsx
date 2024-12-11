import { useAppSelector } from "@/redux/hooks";
import { IJob, IResume } from "@/types/backend";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Modal,
  Radio,
  Row,
  Select,
  Upload,
  message,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";
import enUS from "antd/lib/locale/en_US";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { callCreateResume, callUploadSingleFile } from "@/config/api";
import { useEffect, useState } from "react";
import axios from "axios";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  jobDetail: IJob | null;
}

const ApplyModal = (props: IProps) => {
  const { isModalOpen, setIsModalOpen, jobDetail } = props;
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state.account.user);
  const [urlCV, setUrlCV] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<"library" | "upload">(
    "upload"
  );
  const [libraryCV, setLibraryCV] = useState<string | null>(null);

  const [data, setData] = useState<IResume[]>([]);
  const access_token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/resume-builders/user/${
          user._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const fetchedData: IResume[] = response.data.data.result;
      setData(fetchedData);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user._id) {
      fetchData();
    }
  }, [user._id, access_token]);

  const handleOkButton = async () => {
    if (!urlCV && !libraryCV && isAuthenticated) {
      message.error("Please upload or select CV from library!");
      return;
    }

    if (!isAuthenticated) {
      setIsModalOpen(false);
      navigate(`/login?callback=${window.location.href}`);
    } else {
      //todo
      if (jobDetail) {
        const cvToSubmit = libraryCV || urlCV;
        const typeUrl = libraryCV ? "libraryCV" : "urlCV";
        const res = await callCreateResume(
          cvToSubmit,
          typeUrl,
          jobDetail?.company?._id,
          jobDetail?._id
        );
        if (res.data) {
          message.success("Successful CV posting!");
          setIsModalOpen(false);
        } else {
          notification.error({
            message: "An error occurred!",
            description: res.message,
          });
        }
      }
    }
  };

  const propsUpload: UploadProps = {
    maxCount: 1,
    multiple: false,
    accept: "application/pdf,application/msword, .doc, .docx, .pdf",
    async customRequest({ file, onSuccess, onError }: any) {
      const res = await callUploadSingleFile(file, "resume");
      if (res && res.data) {
        setUrlCV(res.data.fileName);
        if (onSuccess) onSuccess("ok");
      } else {
        if (onError) {
          setUrlCV("");
          const error = new Error(res.message);
          onError({ event: error });
        }
      }
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(
          info?.file?.error?.event?.message ??
            "An error occurred while uploading the file!"
        );
      }
    },
  };

  return (
    <>
      <Modal
        // title="Apply for Job"
        style={{ padding: 0 }}
        title={
          <div className="bg-blue-500 p-2 rounded-md text-white font-bold text-center text-xl">
            Apply for Job
          </div>
        }
        open={isModalOpen}
        onOk={() => handleOkButton()}
        onCancel={() => setIsModalOpen(false)}
        // maskClosable={false}
        okText={isAuthenticated ? "Submit CV application" : "Log in"}
        // cancelButtonProps={{ style: { display: "none" } }}
        cancelText="Cancel"
        destroyOnClose={true}
      >
        <Divider />
        {isAuthenticated ? (
          <div>
            <ConfigProvider locale={enUS}>
              <ProForm
                submitter={{
                  render: () => <></>,
                }}
              >
                <Row gutter={[20, 20]}>
                  <Col span={24}>
                    <div className="text-md">
                      You are applying for a job <b>{jobDetail?.name} </b>in{" "}
                      <b>{jobDetail?.company?.name}</b>
                    </div>
                  </Col>
                  <Col span={24}>
                    <ProFormText
                      fieldProps={{
                        type: "email",
                      }}
                      label="Email"
                      name={"email"}
                      labelAlign="right"
                      disabled
                      initialValue={user?.email}
                    />
                  </Col>
                  {/* <Col span={24}>
                    <ProForm.Item
                      label={"Upload file CV"}
                      rules={[
                        { required: true, message: "Please upload file!" },
                      ]}
                    >
                      <Upload {...propsUpload}>
                        <Button icon={<UploadOutlined />}>
                          Upload your CV (Support *.doc, *.docx, *.pdf, and &lt;
                          5MB )
                        </Button>
                      </Upload>
                    </ProForm.Item>
                  </Col> */}

                  <Col span={24}>
                    <Radio.Group
                      onChange={(e) => setSelectedOption(e.target.value)}
                      value={selectedOption}
                    >
                      <Radio value="library">Choose from My Library</Radio>
                      <Radio value="upload">Upload from Device</Radio>
                    </Radio.Group>
                  </Col>
                  {selectedOption === "library" && (
                    <Col span={24}>
                      <div className="mb-2 text-md">
                        Select a CV from your library:
                      </div>
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Select your CV"
                        onChange={(value) => setLibraryCV(value)}
                        value={libraryCV}
                      >
                        {data?.map((resume, index) => (
                          <Select.Option key={index} value={resume?._id}>
                            {resume?.title}
                          </Select.Option>
                        ))}
                      </Select>
                    </Col>
                  )}

                  {selectedOption === "upload" && (
                    <Col span={24}>
                      <ProForm.Item
                        label={"Upload file CV"}
                        rules={[
                          { required: true, message: "Please upload file!" },
                        ]}
                      >
                        <Upload {...propsUpload}>
                          <Button icon={<UploadOutlined />}>
                            Upload your CV (Support *.doc, *.docx, *.pdf, and
                            &lt; 5MB )
                          </Button>
                        </Upload>
                      </ProForm.Item>
                    </Col>
                  )}
                </Row>
              </ProForm>
            </ConfigProvider>
          </div>
        ) : (
          <div>
            You are not logged in to the system. Please log in to be able to
            "Submit CV application"!
          </div>
        )}
        <Divider />
      </Modal>
    </>
  );
};
export default ApplyModal;

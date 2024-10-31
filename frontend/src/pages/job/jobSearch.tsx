import SearchClient from "@/components/client/search.client";
import {
  Breadcrumb,
  Card,
  Col,
  Empty,
  message,
  Radio,
  Row,
  Tag,
  Typography,
} from "antd";
import styles from "styles/client.module.scss";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaRegBell, FaRegHeart } from "react-icons/fa";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { IJob } from "@/types/backend";
import { callFetchJob } from "@/config/api";
import { convertSlug, getLocationName } from "@/config/utils";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const JobSearch = (props: any) => {
  const [dataJobSearch, setDataJobSearch] = useState<IJob[] | null>(null);
  const [selectedOption, setSelectedOption] = useState("AI");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("name");

  const handleChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

  const fetchJob = async () => {
    try {
      const res = await callFetchJob(`name=${query}`);
      if (res && res.data) {
        setDataJobSearch(res.data.result);
      }
    } catch (error) {
      message.error("Error loading job data!");
    }
  };

  useEffect(() => {
    fetchJob();
  }, [query]);

  const handleViewDetailJob = (item: IJob) => {
    const slug = convertSlug(item.name);
    navigate(`/jobs/${slug}?id=${item._id}`);
  };

  return (
    <>
      <div className="search-content">
        <SearchClient />
      </div>
      <div className={`${styles["home-section"]} bg-gray-100 pt-4 pb-4`}>
        <Row className="flex justify-center items-center">
          <Col span={18} className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">
                Tuyển dụng 104 việc làm Reactjs [Update 25/10/2024]
              </h2>
              <div>
                <Breadcrumb className="text-md">
                  <Breadcrumb.Item>
                    <Link
                      style={{ color: "green", fontWeight: "600" }}
                      className="hover:underline"
                      to="/jobSearch"
                    >
                      Trang chủ
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    TTuyển dụng 104 việc làm Reactjs [Update 25/10/2024]
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
            <button className="flex justify-between items-center bg-white rounded-sm font-semibold p-2  hover:text-green-700 hover:border hover:border-green-700">
              <span className="mr-2">
                <FaRegBell />
              </span>
              Tạo thông báo việc làm
            </button>
          </Col>
        </Row>
        <Row className="flex justify-center items-center mt-4">
          <Col span={18} className="flex justify-between items-center">
            <h2 className="text-xl text-green-600 font-bold">
              Gợi ý việc làm phù hợp
            </h2>
            <Link to="job" className="underline">
              Xem tất cả
            </Link>
          </Col>
        </Row>
        <Row className="flex justify-center items-center mt-4">
          <Col span={18} className="flex items-center">
            <h2 className="mr-4 text-md font-semibold">
              Ưu tiên hiển thị theo:{" "}
            </h2>
            <Radio.Group
              onChange={handleChange}
              value={selectedOption}
              className="flex items-center"
            >
              <Radio
                value="AI"
                className="flex items-center text-md mr-6 font-semibold"
              >
                <span className="mr-1">Search by AI</span>
                <InfoCircleOutlined className="text-green-500" />
              </Radio>
              <Radio className="text-md font-semibold mr-6" value="ngay-dang">
                Ngày đăng
              </Radio>
              <Radio
                className="text-md font-semibold mr-6"
                value="ngay-cap-nhat"
              >
                Ngày cập nhật
              </Radio>
              <Radio
                className="text-md font-semibold mr-6"
                value="luong-cao-den-thap"
              >
                Lương cao đến thấp
              </Radio>
              <Radio
                className="text-md font-semibold mr-6"
                value="can-tuyen-gap"
              >
                Cần tuyển gấp
              </Radio>
            </Radio.Group>
          </Col>
        </Row>

        {/* Danh sách công việc */}
        <Row className="flex justify-center items-center mt-4">
          <Col span={18}>
            {dataJobSearch ? (
              dataJobSearch.map((job) => (
                <Card
                  key={job._id}
                  className="p-0 mb-4 shadow-sm hover:border-green-500 group"
                  bodyStyle={{ padding: 12 }}
                  onClick={() => handleViewDetailJob(job)}
                >
                  <Row className="">
                    <Col span={4} className="flex items-center">
                      <img
                        src={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/images/company/${job?.company?.logo}`}
                        alt={job?.company?.name}
                        className="w-32 h-auto border p-2 rounded-md object-contain"
                      />
                    </Col>
                    <Col span={20} className="pl-6">
                      <div className="border-b pb-3 mb-2">
                        <div className="flex justify-between">
                          <div>
                            <Title
                              level={5}
                              style={{ fontWeight: "bold", fontSize: "20px" }}
                              className="mb-0 group-hover:text-green-600"
                            >
                              {job?.name}{" "}
                              {/* <CheckCircleOutlined className="text-green-500" /> */}
                            </Title>
                            <Text className="text-gray-500 font-semibold">
                              {job?.company?.name}
                            </Text>
                          </div>
                          <Text className="text-green-600 font-bold">
                            {job?.salary
                              ? `${job?.salary.toLocaleString()} VND`
                              : "Thỏa thuận"}
                          </Text>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 font-semibold">
                          <Tag className="bg-gray-100 border rounded-xl">
                            {getLocationName(job?.location)}
                          </Tag>
                          <Tag className="bg-gray-100 border rounded-xl">
                            {job?.level
                              ? job?.level
                              : "Không yêu cầu kinh nghiệm"}
                          </Tag>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text className="text-md font-semibold text-gray-400">
                          Frontend Developer
                        </Text>
                        <div className="flex items-center font-semibold text-gray-400">
                          Cập nhật {dayjs(job?.updatedAt).fromNow()}
                          <span className="ml-4 p-2 border border-green-600 rounded-full">
                            <FaRegHeart
                              size={20}
                              className=" cursor-pointer text-green-600"
                            />
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              <Empty description="Không có dữ liệu công việc" />
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default JobSearch;

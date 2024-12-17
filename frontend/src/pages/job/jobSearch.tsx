import SearchClient from "@/components/client/search.client";
import {
  Breadcrumb,
  Card,
  Col,
  Empty,
  message,
  Pagination,
  Radio,
  Row,
  Skeleton,
  Spin,
  Tag,
  Typography,
} from "antd";
import styles from "styles/client.module.scss";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaRegBell, FaRegHeart } from "react-icons/fa";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { IJob } from "@/types/backend";
import { callFetchJob } from "@/config/api";
import { convertSlug, getLocationName } from "@/config/utils";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const trimQueryString = (query: string) => {
  if (!query || query.length <= 3) return "";
  return query.substring(1, query.length - 2);
};

const JobSearch = (props: any) => {
  const [dataJobSearch, setDataJobSearch] = useState<IJob[] | null>(null);

  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [selectedOption, setSelectedOption] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const name = searchParams.get("name");
  const location = searchParams.get("location");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const queryParams = [
      name ? `name=${name}` : "",
      location ? `location=${location}` : "",
      `current=${pagination.current}`,
      `pageSize=${pagination.pageSize}`,
      `sort=${selectedOption}`,
    ]
      .filter(Boolean)
      .join("&");
    try {
      const res = await callFetchJob(queryParams);
      if (res?.data) {
        setDataJobSearch(res.data.result);
        setPagination((prev) => ({
          ...prev,
          total: res?.data?.meta?.total || 0,
        }));
      } else {
        setDataJobSearch([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      }
    } catch (error) {
      message.error("Error loading job data!");
    } finally {
      setLoading(false);
    }
  }, [name, location, pagination.current, pagination.pageSize, selectedOption]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, selectedOption]);

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  };

  const handleChange = (e: any) => {
    setSelectedOption(e.target.value);
    console.log("sdjkfsjkdfhkjsfhkjds", e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleViewDetailJob = (item: IJob) => {
    const slug = convertSlug(item.name);
    navigate(`/jobs/${slug}?id=${item._id}`);
  };

  const renderSkeletonCard = () => {
    return (
      <Card className="p-0 mb-4 shadow-sm" bodyStyle={{ padding: 12 }}>
        <Row>
          <Col span={4} className="p-2">
            <Skeleton.Avatar
              active
              shape="square"
              size={120}
              className="rounded-md object-contain"
            />
          </Col>

          <Col span={20} className="pl-6">
            <div className="border-b pb-3 mb-2">
              <div className="flex justify-between">
                <div>
                  <Skeleton.Input
                    active
                    style={{ width: 200, height: 24, marginBottom: 8 }}
                  />
                </div>
                <Skeleton.Input active style={{ width: 100, height: 24 }} />
              </div>
              <Skeleton.Input active style={{ width: 150, height: 16 }} />
              <div className="flex items-center space-x-2 mt-2">
                <Skeleton.Button
                  active
                  style={{ width: 100, height: 24, borderRadius: "16px" }}
                />
                <Skeleton.Button
                  active
                  style={{ width: 140, height: 24, borderRadius: "16px" }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Skeleton.Input
                active
                style={{ width: "70%", height: 16, marginBottom: 8 }}
              />
              <Skeleton.Button
                active
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  marginLeft: 16,
                }}
              />
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <>
      <div className="search-content">
        <SearchClient showCarousel={false} showTitle={false} />
      </div>
      <div className={`${styles["home-section"]} bg-gray-100 pt-4 pb-8`}>
        <Row className="flex justify-center items-center">
          <Col span={18} className="flex justify-between items-center">
            <div>
              {" "}
              <div>
                <Breadcrumb className="text-md">
                  <Breadcrumb.Item>
                    <Link
                      style={{ color: "blue", fontWeight: "600" }}
                      className="hover:underline"
                      to="/jobsAll"
                    >
                      Home
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link
                      style={{ color: "blue", fontWeight: "600" }}
                      className="hover:underline"
                      to="/jobs"
                    >
                      Job
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    {trimQueryString(name?.toString() || "")}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <h2 className="text-lg font-bold text-blue-600">
                Recruitment {pagination.total} jobs{" "}
                {trimQueryString(name?.toString() || "")} [Update{" "}
                {dayjs().format("DD/MM/YYYY")}]{" "}
              </h2>
            </div>
            <button className="flex justify-between items-center bg-white rounded-sm font-semibold p-2  hover:text-blue-700 hover:border hover:border-blue-700">
              <span className="mr-2">
                <FaRegBell />
              </span>
              Create job alert
            </button>
          </Col>
        </Row>
        {/* <Row className="flex justify-center items-center mt-4">
          <Col span={18} className="flex justify-between items-center">
            <h2 className="text-xl text-blue-600 font-bold">
              Suggest suitable jobs
            </h2>
            <Link to="job" className="underline">
              View all
            </Link>
          </Col>
        </Row> */}
        <Row className="flex justify-center items-center mt-4">
          <Col span={18} className="flex items-center">
            <h2 className="mr-4 text-md font-semibold">
              Display priority by:{" "}
            </h2>
            <Radio.Group
              onChange={handleChange}
              value={selectedOption}
              className="flex items-center"
            >
              {/* <Radio
                value="AI"
                className="flex items-center text-md mr-6 font-semibold"
              >
                <span className="mr-1">Search by AI</span>
                <InfoCircleOutlined className="text-blue-500" />
              </Radio> */}
              <Radio className="text-md font-semibold mr-6" value="">
                Default
              </Radio>
              <Radio className="text-md font-semibold mr-6" value="ngay-dang">
                Date posted
              </Radio>
              <Radio
                className="text-md font-semibold mr-6"
                value="ngay-cap-nhat"
              >
                Update date
              </Radio>
              <Radio className="text-md font-semibold mr-6" value="salary">
                Salary high to low
              </Radio>
              {/* <Radio
                className="text-md font-semibold mr-6"
                value="can-tuyen-gap"
              >
                Urgent hiring
              </Radio> */}
            </Radio.Group>
          </Col>
        </Row>

        {/* Danh sách công việc */}
        {/* <Spin spinning={loading} tip="Loading..."> */}
        <Row className="flex justify-center items-center mt-4">
          <Col span={18}>
            {loading ? (
              Array.from({ length: pagination?.pageSize || 5 }).map(
                (_, index) => <div key={index}>{renderSkeletonCard()}</div>
              )
            ) : dataJobSearch && dataJobSearch.length > 0 ? (
              dataJobSearch.map((job) => (
                <Card
                  key={job._id}
                  className="p-0 mb-4 shadow-sm hover:border-blue-500 group"
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
                              className="mb-0 group-hover:text-blue-600"
                            >
                              {job?.name}{" "}
                            </Title>
                            <Text className="text-gray-500 font-semibold">
                              {job?.company?.name}
                            </Text>
                          </div>
                          <Text className="text-blue-600 font-bold">
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
                          {job?.name}
                        </Text>
                        <div className="flex items-center font-semibold text-gray-400">
                          Update {dayjs(job?.updatedAt).format("DD/MM/YYYY")}
                          <span className="ml-4 p-2 border border-blue-600 rounded-full">
                            <FaRegHeart
                              size={20}
                              className=" cursor-pointer text-blue-600"
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

        {dataJobSearch && dataJobSearch.length > 0 && (
          <Row className="flex justify-center items-center mt-4">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
            />
          </Row>
        )}
        {/* </Spin> */}
      </div>
    </>
  );
};

export default JobSearch;

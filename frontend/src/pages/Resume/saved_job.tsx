import {
  Card,
  Row,
  Col,
  Empty,
  Tag,
  Typography,
  Skeleton,
  Pagination,
} from "antd";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { convertSlug } from "@/config/utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { callFetchSavedJobs } from "@/config/api";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface Job {
  _id: string;
  name: string;
  skills: string[];
  company: {
    _id: string;
    name: string;
    logo: string;
  };
  location: string;
  salary: number;
  level: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    email: string;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SavedJob {
  _id: string;
  userId: string;
  jobId: Job;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const Saved_Jobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const userId = useSelector((state: any) => state.account.user?._id);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const fetchData = async () => {
    if (userId) {
      try {
        setLoading(true);
        const response = await callFetchSavedJobs(userId);
        setSavedJobs(response.data);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleViewDetailJob = (job: any) => {
    const slug = convertSlug(job?.jobId?.name);
    navigate(`/jobs/${slug}?id=${job?.jobId?._id}`);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-8">
      <div className="bg-gray-100 pt-4 pb-8">
        <div className="flex justify-center items-center">
          <Col className="text-2xl font-bold text-blue-600" span={18}>
            List of saved jobs
          </Col>
        </div>
        <Row className="flex justify-center items-center mt-4">
          <Col span={18}>
            {loading ? (
              Array(5)
                .fill(null)
                .map((_, index) => <div key={index}>{renderSkeletonCard()}</div>) // Hiển thị 3 Skeleton Cards khi loading
            ) : savedJobs && savedJobs?.length > 0 ? (
              savedJobs.map((savedJob) => {
                const job = savedJob?.jobId;
                return (
                  <Card
                    key={savedJob?._id}
                    className="p-0 mb-4 shadow-sm hover:border-blue-500 group"
                    bodyStyle={{ padding: 12 }}
                    onClick={() => handleViewDetailJob(savedJob)}
                  >
                    <Row>
                      <Col span={4} className="flex items-center">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL
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
                                {job?.name}
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
                              {job?.location}
                            </Tag>
                            <Tag className="bg-gray-100 border rounded-xl">
                              {job?.level || "Không yêu cầu kinh nghiệm"}
                            </Tag>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Text className="text-md font-semibold text-gray-400">
                            {job?.name}
                          </Text>
                          <div className="flex items-center font-semibold text-gray-400">
                            Update{" "}
                            {dayjs(savedJob?.updatedAt).format("DD/MM/YYYY")}
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
                );
              })
            ) : (
              <Empty className="mb-36" description="No jobs saved!" />
            )}
          </Col>
        </Row>

        {/* Pagination */}
        {savedJobs && savedJobs?.length > 0 && (
          <Row className="flex justify-center items-center mt-4">
            <Col span={18} className="flex justify-center">
              <Pagination
                current={currentPage}
                total={savedJobs.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default Saved_Jobs;

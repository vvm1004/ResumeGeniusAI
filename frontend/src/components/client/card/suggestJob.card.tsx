import { callFetchJob, callFetchSuggestJob } from "@/config/api";
import { convertSlug } from "@/config/utils";
import { IJob } from "@/types/backend";
import { Card, Col, Empty, message, Row, Skeleton } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Redux hook
import { useNavigate } from "react-router-dom";
import styles from "styles/client.module.scss";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { CiHeart } from "react-icons/ci";

const SuggestJobCard = () => {
  const [jobs, setJobs] = useState<IJob[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const userId = useSelector((state: any) => state.account.user._id); // Lấy userId từ Redux
  const navigate = useNavigate();

  // If there's no userId, don't render anything
  if (!userId) {
    return null; // Or you can return a message like <Empty description="No user ID found" />
  }

  // Hàm fetch dữ liệu job
  const fetchJobs = async () => {
    if (!userId) {
      message.error("User ID is missing!");
      return;
    }

    setLoading(true);
    try {
      const res = await callFetchSuggestJob(`userId=${userId}`);
      console.log(res)
      if (res?.data) {
        setJobs(res.data); // Set only the "result" array, not the whole response
      }
    } catch (error) {
      message.error("Error loading job data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(); // Gọi API khi component mount
  }, [userId]);

  // Hàm xử lý xem chi tiết job
  const viewJobDetails = (item: IJob) => {
    const slug = convertSlug(item.name);
    navigate(`/jobs/${slug}?id=${item._id}`);
  };

  return (
    <div
      className={`${styles["container"]} ${styles["card-job-section"]} pb-8 pl-14 pr-14`}
    >
      <div className={`${styles["job-content"]}`}>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <div className="text-2xl text-blue-600 font-bold pt-4">
              Recommended Jobs
            </div>
          </Col>

          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
              <Col span={24} md={8} key={index}>
                <Card className="p-0 mb-4 shadow-sm">
                  <Skeleton active />
                </Card>
              </Col>
            ))
            : jobs?.map((item) => (
              <Col span={24} md={8} key={item._id}>
                <Card
                  className="w-full job-card hover-effect"
                  hoverable
                  onClick={() => viewJobDetails(item)}
                >
                  <div className="flex justify-between">
                    <div className="mr-4">
                      <img
                        className="w-16 h-auto"
                        alt={`${import.meta.env.VITE_BACKEND_URL
                          }/images/company/${item?.company?.name}`}
                        src={`${import.meta.env.VITE_BACKEND_URL
                          }/images/company/${item?.company?.logo}`}
                      />
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="text-lg font-semibold truncate">
                        {item.name}
                      </div>
                      <div className="text-md text-gray-500 font-semibold truncate">
                        {item?.company?.name}
                      </div>
                      <div className="w-full flex mt-2 mb-2">
                        <div className="w-1/2 flex items-center mr-2 overflow-hidden whitespace-nowrap">
                          <IoLocationOutline
                            style={{
                              fontSize: 20,
                              color: "blue",
                              marginRight: "4px",
                            }}
                          />
                          {item.location}
                        </div>

                        <div className="w-1/2 flex items-center overflow-hidden whitespace-nowrap">
                          <HiOutlineCurrencyDollar
                            style={{
                              fontSize: 20,
                              color: "blue",
                              marginRight: "4px",
                            }}
                          />
                          {item.salary} vnđ
                        </div>
                      </div>
                      <CiHeart
                        className="absolute right-2 bottom-2 hover:text-blue-600"
                        size={25}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            ))}

          {!jobs?.length && !loading && (
            <div className={styles["empty"]}>
              <Empty description="No data available" />
            </div>
          )}
        </Row>
      </div>
    </div>
  );
};

export default SuggestJobCard;

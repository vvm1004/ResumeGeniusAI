import { callFetchJob } from "@/config/api";
import { LOCATION_LIST, convertSlug, getLocationName } from "@/config/utils";
import { IJob } from "@/types/backend";
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  message,
  Pagination,
  Row,
  Select,
  Spin,
} from "antd";
import { useState, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import styles from "styles/client.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
dayjs.extend(relativeTime);

const { Option } = Select;

interface IProps {
  showPagination?: boolean;
}

const JobCard = (props: IProps) => {
  const { showPagination = false } = props;

  const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
  const navigate = useNavigate();

  // State cho bộ lọc
  const [mainFilter, setMainFilter] = useState("location");
  const [subFilter, setSubFilter] = useState("");
  const filterButtonContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchJob = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    try {
      const res = await callFetchJob(query);
      if (res && res.data) {
        setDisplayJob(res.data.result);
        setTotal(res.data.meta.total);
      }
    } catch (error) {
      message.error("Error loading job data!");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, [current, pageSize, filter, sortQuery]);

  const handleOnchangePage = (pagination: {
    current: number;
    pageSize: number;
  }) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const handleViewDetailJob = (item: IJob) => {
    const slug = convertSlug(item.name);
    navigate(`/jobs/${slug}?id=${item._id}`);
  };

  const handleMainFilterChange = (value: string) => {
    setMainFilter(value);
    setSubFilter("tatca");
    setCurrent(1);
  };

  const handleSubFilterChange = (value: string) => {
    setSubFilter(value);
    setCurrent(1);
  };

  const filterOptions = {
    location: [
      { value: "tatca", label: "Tất cả" },
      { value: "hanoi", label: "Hà Nội" },
      { value: "danang", label: "Đà Nẵng" },
      { value: "hochiminh", label: "Thành phố Hồ Chí Minh" },
    ],
    salary: [
      { value: "tatca", label: "Tất cả" },
      { value: "10000000", label: "Dưới 10 triệu" },
      { value: "10000000-15000000", label: "Từ 10 đến 15 triệu" },
      { value: "15000000-20000000", label: "Từ 15 đến 20 triệu" },
      { value: "20000000-30000000", label: "Từ 20 đến 30 triệu" },
      { value: "30000000", label: "Trên 30 triệu" },
      { value: "thoathuan", label: "Thỏa thuận" },
    ],
    experience: [
      { value: "tatca", label: "Tất cả" },
      { value: "0", label: "Chưa có kinh nghiệm" },
      { value: "1", label: "1 năm" },
      { value: "2", label: "2 năm" },
      { value: "3", label: "3 năm" },
    ],
    industry: [
      { value: "tatca", label: "Tất cả" },
      { value: "it", label: "Công nghệ thông tin" },
      { value: "marketing", label: "Marketing" },
      { value: "finance", label: "Tài chính" },
      { value: "education", label: "Giáo dục" },
    ],
  };

  const getSubFilterButtons = () => {
    switch (mainFilter) {
      case "location":
        return filterOptions.location.map((loc) => (
          <button
            className={`cus-btn p-2 pl-4 pr-4 mr-2 bg-gray-200 rounded-xl text-md text-black cursor-pointer ${
              subFilter === loc.value ? " choose-btn" : ""
            }`}
            key={loc.value}
            onClick={() => handleSubFilterClick(loc.value)}
          >
            {loc.label}
          </button>
        ));
      case "salary":
        return filterOptions.salary.map((salary) => (
          <>
            <button
              className={`cus-btn p-2 pl-4 pr-4 mr-2 bg-gray-200 rounded-xl text-md text-black cursor-pointer ${
                subFilter === salary.value ? " choose-btn" : ""
              }`}
              key={salary.value}
              onClick={() => handleSubFilterClick(salary.value)}
            >
              {salary.label}
            </button>
          </>
        ));
      case "experience":
        return filterOptions.experience.map((experience) => (
          <>
            <button
              className={`cus-btn p-2 pl-4 pr-4 mr-2 bg-gray-200 rounded-xl text-md text-black cursor-pointer ${
                subFilter === experience.value ? " choose-btn" : ""
              }`}
              key={experience.value}
              onClick={() => handleSubFilterClick(experience.value)}
            >
              {experience.label}
            </button>
          </>
        ));
      case "industry":
        return filterOptions.industry.map((industry) => (
          <>
            <button
              className={`cus-btn p-2 pl-4 pr-4 mr-2 bg-gray-200 rounded-xl text-md text-black cursor-pointer ${
                subFilter === industry.value ? " choose-btn" : ""
              }`}
              key={industry.value}
              onClick={() => handleSubFilterClick(industry.value)}
            >
              {industry.label}
            </button>
          </>
        ));
      default:
        return null;
    }
  };

  const handleSubFilterClick = (value: string) => {
    setSubFilter(value);
    setCurrent(1);
  };

  const scrollLeft = () => {
    if (filterButtonContainerRef.current) {
      filterButtonContainerRef.current.scrollBy({
        left: -150,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (filterButtonContainerRef.current) {
      filterButtonContainerRef.current.scrollBy({
        left: 150, 
        behavior: 'smooth', 
      });
    }
  };

  return (
    <div
      className={`${styles["container"]} ${styles["card-job-section"]} pb-8 pl-14 pr-14`}
    >
      <div className={`${styles["job-content"]}`}>
        <Spin spinning={isLoading} tip="Loading...">
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <div
                className={
                  isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]
                }
              >
                <div className="text-2xl text-green-600 font-bold pt-4">
                  Công Việc Mới Nhất
                </div>
                {!showPagination && (
                  <div className="flex justify-center items-center">
                    <Link to="job" className="pt-4 mr-2">
                      Xem tất cả
                    </Link>
                    <span className="pt-4 mr-1">
                      <MdOutlineChevronLeft
                        className="border-2 rounded-full"
                        size={30}
                      />
                    </span>
                    <span className="pt-4 mr-2">
                      <MdOutlineChevronRight
                        className="border-2 rounded-full"
                        size={30}
                      />
                    </span>
                  </div>
                )}
              </div>
            </Col>

            {/* Filter */}
            <Col
              span={6}
              className="filter mr-10 bg-white border border-gray-300 rounded-md "
            >
              <div className="flex items-center">
                <span className="flex items-center text-gray-500 text-md font-semibold mr-4">
                  <IoFilter className="mr-2" />
                  Lọc theo:
                </span>
                <Select
                  className="cus-select"
                  value={mainFilter}
                  onChange={handleMainFilterChange}
                  style={{ width: 165 }}
                >
                  <Option value="location">Địa điểm</Option>
                  <Option value="salary">Mức lương</Option>
                  <Option value="experience">Kinh nghiệm</Option>
                  <Option value="industry">Ngành nghề</Option>
                </Select>
              </div>
            </Col>

            <Col span={17} className="flex justify-between items-center">
              <span className="mr-4 cursor-pointer" onClick={scrollLeft}>
                <MdOutlineChevronLeft
                  className="border-2 rounded-full"
                  size={30}
                />
              </span>
              <div className="whitespace-nowrap overflow-hidden" ref={filterButtonContainerRef}>
                {getSubFilterButtons()}
              </div>
              <span className="ml-4 cursor-pointer" onClick={scrollRight}>
                <MdOutlineChevronRight
                  className="border-2 rounded-full"
                  size={30}
                />
              </span>
            </Col>

            {displayJob?.map((item) => {
              return (
                <Col span={24} md={8} key={item._id}>
                  <Card
                    size="small"
                    title={null}
                    hoverable
                    onClick={() => handleViewDetailJob(item)}
                  >
                    <div className={styles["card-job-content"]}>
                      <div className={styles["card-job-left"]}>
                        <img
                          alt="example"
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/company/${item?.company?.logo}`}
                        />
                      </div>
                      <div className={styles["card-job-right"]}>
                        <div className={styles["job-title"]}>{item.name}</div>
                        <div className={styles["job-location"]}>
                          <EnvironmentOutlined style={{ color: "#58aaab" }} />
                          &nbsp;{getLocationName(item.location)}
                        </div>
                        <div>
                          <ThunderboltOutlined style={{ color: "orange" }} />
                          &nbsp;
                          {(item.salary + "")?.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ","
                          )}{" "}
                          đ
                        </div>
                        <div className={styles["job-updatedAt"]}>
                          {dayjs(item.updatedAt).fromNow()}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}

            {(!displayJob || (displayJob && displayJob.length === 0)) &&
              !isLoading && (
                <div className={styles["empty"]}>
                  <Empty description="Không có dữ liệu" />
                </div>
              )}
          </Row>

          {showPagination && (
            <>
              <div style={{ marginTop: 30 }}></div>
              <Row style={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  current={current}
                  total={total}
                  pageSize={pageSize}
                  responsive
                  onChange={(p: number, s: number) =>
                    handleOnchangePage({ current: p, pageSize: s })
                  }
                />
              </Row>
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default JobCard;

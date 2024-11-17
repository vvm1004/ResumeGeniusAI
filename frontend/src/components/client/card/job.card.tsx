import { callFetchJob } from "@/config/api";
import { convertSlug, getLocationName } from "@/config/utils";
import { IJob } from "@/types/backend";
import { Card, Col, Empty, message, Pagination, Row, Select, Spin } from "antd";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import styles from "styles/client.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { IoFilter, IoLocationOutline } from "react-icons/io5";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { CiHeart } from "react-icons/ci";
dayjs.extend(relativeTime);

const { Option } = Select;

const JobCard = () => {
  const [jobs, setJobs] = useState<IJob[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9,
    total: 0,
  });

  type FilterMain = "location" | "salary" | "experience" | "industry";

  const [filters, setFilters] = useState<{
    main: FilterMain;
    sub: string;
    sort: string;
  }>({
    main: "location",
    sub: "tatca",
    sort: "sort=-updateAt",
  });

  const navigate = useNavigate();
  const filterContainerRef = useRef<HTMLDivElement | null>(null);

  const filterOptions = useMemo(
    () => ({
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
    }),
    []
  );

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    // const query = `current=${pagination.current}&pageSize=${pagination.pageSize}&${filters.main}=${filters.sub}&${filters.sort}`;
    const query = `current=${pagination.current}&pageSize=${pagination.pageSize}&${filters.sort}`;

    try {
      const res = await callFetchJob(query);
      if (res?.data) {
        setJobs(res.data.result);
        setPagination((prev) => ({
          ...prev,
          total: res?.data?.meta?.total || 0,
        }));
      }
    } catch (error) {
      message.error("Error loading job data!");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize, total: pagination.total });
  };

  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
    if (type === "main") {
      setFilters((prev) => ({ ...prev, sub: "tatca" }));
    }
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const renderFilterButtons = () =>
    filterOptions[filters.main]?.map((opt) => (
      <button
        key={opt.value}
        className={`cus-btn p-2 pl-4 pr-4 mr-2 bg-gray-200 rounded-xl text-md border border-gray-200 ${
          filters.sub === opt.value ? "choose-btn" : ""
        }`}
        onClick={() => handleFilterChange("sub", opt.value)}
      >
        {opt.label}
      </button>
    ));

  const scrollFilterContainer = (direction: number) => {
    if (filterContainerRef.current) {
      filterContainerRef.current.scrollBy({
        left: direction * 150,
        behavior: "smooth",
      });
    }
  };

  const viewJobDetails = (item: IJob) => {
    const slug = convertSlug(item.name);
    navigate(`/jobs/${slug}?id=${item._id}`);
  };

  return (
    <div
      className={`${styles["container"]} ${styles["card-job-section"]} pb-8 pl-14 pr-14`}
    >
      <div className={`${styles["job-content"]}`}>
        <Spin spinning={loading} tip="Loading...">
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

                <div className="flex justify-center items-center">
                  <Link
                    to="/jobs"
                    className="pt-4 mr-2 underline hover:text-green-700"
                  >
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
                  value={filters.main}
                  onChange={(value) => handleFilterChange("main", value)}
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
              <span
                className="mr-4 cursor-pointer"
                onClick={() => scrollFilterContainer(-1)}
              >
                <MdOutlineChevronLeft
                  className="border-2 rounded-full"
                  size={30}
                />
              </span>
              <div
                className="whitespace-nowrap overflow-hidden"
                ref={filterContainerRef}
              >
                {renderFilterButtons()}
              </div>
              <span
                className="ml-4 cursor-pointer"
                onClick={() => scrollFilterContainer(1)}
              >
                <MdOutlineChevronRight
                  className="border-2 rounded-full"
                  size={30}
                />
              </span>
            </Col>

            {jobs?.map((item) => {
              return (
                <Col span={24} md={8} key={item._id}>
                  <Card
                    className="w-full "
                    title={null}
                    hoverable
                    onClick={() => viewJobDetails(item)}
                  >
                    <div className="flex justify-between">
                      <div className="mr-4">
                        <img
                          className="w-16 h-auto"
                          alt={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/company/${item?.company?.name}`}
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
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
                                color: "green",
                                marginRight: "4px",
                              }}
                            />
                            {getLocationName(item.location)}
                          </div>

                          <div className="w-1/2 flex items-center overflow-hidden whitespace-nowrap">
                            <HiOutlineCurrencyDollar
                              style={{
                                fontSize: 20,
                                color: "green",
                                marginRight: "4px",
                              }}
                            />
                            {item.salary}
                            vnđ
                          </div>
                        </div>
                        <CiHeart
                          className="absolute right-2 bottom-2 hover:text-green-600"
                          size={25}
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}

            {(!jobs || (jobs && jobs.length === 0)) && !loading && (
              <div className={styles["empty"]}>
                <Empty description="Không có dữ liệu" />
              </div>
            )}

            {jobs &&
              jobs.length > 0 &&
              pagination.total > pagination.pageSize && (
                <Col
                  span={24}
                  className="flex justify-center items-center whitespace-nowrap"
                >
                  <Pagination
                    defaultCurrent={pagination.current}
                    total={pagination.total}
                    pageSize={pagination.pageSize}
                    responsive
                    onChange={handlePageChange}
                  />
                </Col>
              )}
          </Row>
        </Spin>
      </div>
    </div>
  );
};

export default JobCard;

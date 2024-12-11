import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ICompany, IJob } from "@/types/backend";
import { callFetchCompanyById, callFetchJobById } from "@/config/api";
import { Breadcrumb, Col, Row, Skeleton } from "antd";
import { getLocationName } from "@/config/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ApplyModal from "@/components/client/modal/apply.modal";
import SearchClient from "@/components/client/search.client";
import { Link } from "react-router-dom";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoLocationSharp } from "react-icons/io5";
import { FaAddressBook, FaRegBell, FaRegClock, FaUser } from "react-icons/fa";
import { IoIosSend, IoMdHeartEmpty } from "react-icons/io";
import { BsBoxArrowInUpRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
dayjs.extend(relativeTime);

const ClientJobDetailPage = (props: any) => {
  const [jobDetail, setJobDetail] = useState<IJob | null>(null);
  const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id");

  useEffect(() => {
    const fetchJobDetail = async () => {
      setIsLoading(true);
      if (id) {
        const res = await callFetchJobById(id);
        setJobDetail(res.data || null);
      }
    };
    const fetchCompanyDetail = async () => {
      if (jobDetail?.company?._id) {
        const res = await callFetchCompanyById(jobDetail.company._id);
        // const res = await callFetchCompanyById("670bd5024c872eb686978a2f");
        setCompanyDetail(res.data || null);
      }
    };
    const fetchData = async () => {
      await fetchJobDetail();
      await fetchCompanyDetail();
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  const renderSkeleton = () => {
    return (
      <div className="w-full flex">
        <div className="w-2/3 ml-36 flex justify-end items-center flex-wrap">
          <Row
            className="w-full flex items-center rounded-md bg-white p-4"
            gutter={[20, 5]}
          >
            <Col span={24}>
              <Skeleton.Input active size="small" block />
            </Col>
            <Col span={24}>
              <Skeleton.Button
                active
                size="small"
                style={{ width: 100 }}
                block
              />
            </Col>
            <Col md={24} className="flex items-center mt-4">
              <div className="w-1/3 flex items-center mr-2">
                <Skeleton.Avatar
                  active
                  size="large"
                  shape="square"
                  className="mr-2"
                />
                <Skeleton.Input active size="small" block />
              </div>
              <div className="w-1/3 flex items-center mr-2">
                <Skeleton.Avatar
                  active
                  size="large"
                  shape="square"
                  className="mr-2"
                />
                <Skeleton.Input active size="small" block />
              </div>
              <div className="w-1/3 flex items-center">
                <Skeleton.Avatar
                  active
                  size="large"
                  shape="square"
                  className="mr-2"
                />
                <Skeleton.Input active size="small" block />
              </div>
            </Col>
            <Col span={9} className="mt-4">
              <Skeleton.Input active size="default" block />
            </Col>
            <Col span={18} className="mt-4">
              <Skeleton.Button active size="large" block />
            </Col>
            <Col span={5} className="mt-4">
              <Skeleton.Button active size="large" block />
            </Col>
          </Row>
          <Row
            className="mt-6 w-full flex items-center rounded-md bg-white p-4"
            gutter={[20, 5]}
          >
            <Col span={24}>
              <Skeleton.Input active size="large" block />
            </Col>
            <Col span={24}>
              <Skeleton active paragraph={{ rows: 5 }} />
            </Col>
          </Row>
        </div>

        <div className="w-1/3 ml-10 mr-36 bg-white rounded-md self-start">
          <Row className="w-full flex justify-center p-4" gutter={[20, 15]}>
            <Col span={8}>
              <Skeleton.Avatar active size={100} shape="square" />
            </Col>
            <Col span={15}>
              <Skeleton.Input active size="small" block />
            </Col>
            <Col span={22}>
              <Skeleton.Input active size="small" block />
            </Col>
            <Col span={22}>
              <Skeleton.Input active size="small" block />
            </Col>
            <Col span={22}>
              <Skeleton.Input active size="small" block />
            </Col>
            <Col span={15}>
              <Skeleton.Button active size="small" block />
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  const handleClick = (name: string, id: string) => {
    navigate(`/company/${name}?id=${id}`);
  };

  return (
    <>
      <div className="">
        <SearchClient showCarousel={false} showTitle={false} />
      </div>

      <div className="bg-gray-200 pt-4 pb-4">
        <Row className="flex justify-center items-center p-4">
          <Col md={19}>
            <Breadcrumb className="text-lg">
              {[
                { name: "Home", path: "/jobsAll" },
                { name: "Job", path: "/jobs" },
                // {
                //   name: "Tìm việc làm Front End Developer",
                //   path: "/jobSearch",
                // },
                { name: `Recruitment ${jobDetail?.name}`, path: null },
              ].map((breadcrumb, index) => (
                <Breadcrumb.Item key={index}>
                  {breadcrumb.path ? (
                    <Link
                      style={{ color: "blue", fontWeight: "600" }}
                      className="hover:underline"
                      to={breadcrumb.path}
                    >
                      {breadcrumb.name}
                    </Link>
                  ) : (
                    <span className="font-semibold">{breadcrumb.name}</span>
                  )}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </Col>
        </Row>

        {isLoading ? (
          renderSkeleton()
        ) : (
          <>
            <div className="w-full flex">
              <div className="w-2/3 ml-36 flex justify-end items-center flex-wrap">
                {jobDetail && jobDetail._id && (
                  <>
                    <Row
                      className="w-full flex items-center rounded-md bg-white p-4"
                      gutter={[20, 5]}
                    >
                      <Col span={24} className="text-xl font-bold">
                        {jobDetail.name}
                      </Col>
                      <Col
                        span={24}
                        className="text-gray-600 text-sm font-semibold"
                      >
                        {jobDetail?.company?.name}
                      </Col>
                      <Col md={24} className="flex items-center mt-4">
                        <div className="w-1/3 flex items-center">
                          <div>
                            <RiMoneyDollarCircleLine
                              className="mr-2"
                              size={40}
                              color="blue"
                            />
                          </div>
                          <div>
                            <div className="text-md font-semibold">Salary</div>
                            {jobDetail?.salary}
                          </div>
                        </div>
                        <div className="w-1/3 flex items-center">
                          <div>
                            <IoLocationSharp
                              className="mr-2"
                              size={40}
                              color="blue"
                            />
                          </div>
                          <div>
                            <div className="text-md font-semibold">
                              Location
                            </div>
                            {getLocationName(jobDetail?.location)}
                          </div>
                        </div>
                        <div className="w-1/3 flex items-center">
                          <div>
                            <FaAddressBook
                              className="mr-2"
                              size={40}
                              color="blue"
                            />
                          </div>
                          <div>
                            <div className="text-md font-semibold">
                              Experience
                            </div>
                            {jobDetail?.level}
                          </div>
                        </div>
                      </Col>
                      <Col
                        span={9}
                        className="mt-4 p-2 flex items-center bg-gray-200 text-md text-gray-600 rounded-sm"
                      >
                        <FaRegClock size={20} className="mr-2" />
                        Application deadline:{" "}
                        {dayjs(jobDetail?.endDate).format("DD/MM/YYYY")}
                      </Col>
                      <Col
                        span={18}
                        className="mt-4 mr-2 p-2 bg-blue-500 flex justify-center items-center rounded-md cursor-pointer hover:bg-blue-600"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <button className="flex justify-center items-center font-bold text-white text-md">
                          <IoIosSend size={30} />
                          Apply now
                        </button>
                      </Col>
                      <Col
                        span={5}
                        className="mt-4 p-2 text-lg rounded-sm font-semibold flex justify-center items-center cursor-pointer border-1 border-blue-400 text-blue-600 hover:border-blue-600"
                      >
                        <IoMdHeartEmpty className="mr-2" size={20} />
                        Save news
                      </Col>
                    </Row>
                    <Row
                      className="mt-6 w-full flex items-center rounded-md bg-white p-4"
                      gutter={[20, 5]}
                    >
                      <Col
                        span={24}
                        className="p-2 flex justify-between items-center"
                      >
                        <div className="pl-2 border-l-8 border-l-blue-600 text-xl font-bold">
                          Job posting details
                        </div>
                        <button className="p-2 text-md rounded-sm font-semibold flex items-center cursor-pointer border-1 border-blue-400 text-blue-600 hover:border-blue-600">
                          <FaRegBell className="mr-2" />
                          Send me similar jobs
                        </button>
                      </Col>
                      <Col
                        span={24}
                        dangerouslySetInnerHTML={{
                          __html: jobDetail?.description,
                        }}
                      ></Col>
                    </Row>
                  </>
                )}
              </div>
              {jobDetail && jobDetail._id && (
                <div className="w-1/3 ml-10 mr-36 bg-white rounded-md self-start">
                  <Row
                    className="w-full flex justify-center p-4"
                    gutter={[20, 5]}
                  >
                    <Col span={8} className="flex items-center">
                      <img
                        src={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/images/company/${jobDetail?.company?.logo}`}
                        alt={jobDetail?.company?.name}
                        className="w-full h-auto border p-2 rounded-md object-contain"
                      />
                    </Col>
                    <Col className="ml-2 pt-2 text-lg font-bold" span={15}>
                      {jobDetail?.company?.name}
                    </Col>
                    <Col
                      className="p-2 flex items-center text-md text-gray-600 font-semibold"
                      span={22}
                    >
                      <FaUser className="mr-2" size={15} />
                      Scale:
                      <span className="ml-4 text-black">
                        {companyDetail?.minScale && companyDetail?.maxScale
                          ? `${companyDetail.minScale} - ${companyDetail.maxScale} staffs`
                          : ""}
                      </span>
                    </Col>
                    <Col
                      className="p-2 flex items-center text-md text-gray-600 font-semibold"
                      span={22}
                    >
                      <FaUser className="mr-2" size={15} />
                      Field:
                      <span className="ml-4 text-black">
                        {companyDetail?.name ? companyDetail?.name : ""}
                      </span>
                    </Col>
                    <Col
                      className="p-2 flex items-center text-md text-gray-600 font-semibold"
                      span={22}
                    >
                      <FaUser className="mr-2" size={15} />
                      Location:
                      <span className="ml-4 text-black">
                        {companyDetail?.address ? companyDetail?.address : ""}
                      </span>
                    </Col>
                    <Col className="flex justify-center items-center text-blue-600 text-md font-bold hover:underline" onClick={() => handleClick(companyDetail?.name || "", companyDetail?._id || "")}>
                      View company page{" "}
                      <BsBoxArrowInUpRight className="ml-2" size={18} />
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          </>
        )}
        <ApplyModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          jobDetail={jobDetail}
        />
      </div>
    </>
  );
};
export default ClientJobDetailPage;

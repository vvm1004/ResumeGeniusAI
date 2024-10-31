import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { IJob } from "@/types/backend";
import { callFetchJobById } from "@/config/api";
import { Breadcrumb, Col, Divider, Row, Skeleton, Tag } from "antd";
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
import { BsBoxArrowInUpRight, BsBoxArrowUpRight } from "react-icons/bs";
dayjs.extend(relativeTime);

const ClientJobDetailPage = (props: any) => {
  const [jobDetail, setJobDetail] = useState<IJob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id"); // job id

  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true);
        const res = await callFetchJobById(id);
        if (res?.data) {
          setJobDetail(res.data);
        }
        setIsLoading(false);
      }
    };
    init();
  }, [id]);

  return (
    <>
      <div className="">
        <SearchClient showCarousel={false} showTitle={false} />
      </div>
      <div className="bg-gray-200 pt-4 pb-4">
        <Row className="flex justify-center items-center p-4">
          <Col md={19}>
            <Breadcrumb className="text-lg ">
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
                <Link
                  style={{ color: "green", fontWeight: "600" }}
                  className="hover:underline"
                  to="/jobSearch"
                >
                  Việc làm
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link
                  style={{ color: "green", fontWeight: "600" }}
                  className="hover:underline"
                  to="/jobSearch"
                >
                  Tìm việc làm Front End Developer
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item className="font-semibold">
                Tuyển Front End Developer (Reactjs)
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        {isLoading ? (
          <Skeleton />
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
                              color="green"
                            />
                          </div>
                          <div>
                            <div className="text-md font-semibold">
                              Mức lương
                            </div>
                            {jobDetail?.salary}
                          </div>
                        </div>
                        <div className="w-1/3 flex items-center">
                          <div>
                            <IoLocationSharp
                              className="mr-2"
                              size={40}
                              color="green"
                            />
                          </div>
                          <div>
                            <div className="text-md font-semibold">
                              Địa điểm
                            </div>
                            {getLocationName(jobDetail?.location)}
                          </div>
                        </div>
                        <div className="w-1/3 flex items-center">
                          <div>
                            <FaAddressBook
                              className="mr-2"
                              size={40}
                              color="green"
                            />
                          </div>
                          <div>
                            <div className="text-md font-semibold">
                              Kinh nghiệm
                            </div>
                            {jobDetail?.level}
                          </div>
                        </div>
                      </Col>
                      <Col
                        span={7}
                        className="mt-4 p-2 flex items-center bg-gray-200 text-md text-gray-600 rounded-sm"
                      >
                        <FaRegClock size={20} className="mr-2" />
                        Hạn nộp hồ sơ: 01/01/2025
                      </Col>
                      <Col
                        span={18}
                        className="mt-4 mr-2 p-2 bg-green-500 flex justify-center items-center rounded-md cursor-pointer hover:bg-green-600"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <button className="flex justify-center items-center font-bold text-white text-md">
                          <IoIosSend size={30} />
                          Ứng tuyển ngay
                        </button>
                      </Col>
                      <Col
                        span={4}
                        className="mt-4 p-2 text-lg rounded-sm font-semibold flex justify-center items-center cursor-pointer border border-green-400 text-green-600 hover:border-green-600"
                      >
                        <IoMdHeartEmpty className="mr-2" size={20} />
                        Lưu tin
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
                        <div className="pl-2 border-l-8 border-l-green-600 text-xl font-bold">
                          Chi tiết tin tuyển dụng
                        </div>
                        <button className="p-2 text-md rounded-sm font-semibold flex items-center cursor-pointer border border-green-400 text-green-600 hover:border-green-600">
                          <FaRegBell className="mr-2" />
                          Gửi tôi việc làm tương tự
                        </button>
                      </Col>
                      <Col
                        span={24}
                        dangerouslySetInnerHTML={{__html: jobDetail?.description}}
                      >
                      </Col>
                    </Row>
                  </>
                )}
              </div>
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
                    Quy mô:
                    <span className="ml-4 text-black">100-499 nhân viên</span>
                  </Col>
                  <Col
                    className="p-2 flex items-center text-md text-gray-600 font-semibold"
                    span={22}
                  >
                    <FaUser className="mr-2" size={15} />
                    Lĩnh vực:
                    <span className="ml-4 text-black">IT - Phần mềm</span>
                  </Col>
                  <Col
                    className="p-2 flex items-center text-md text-gray-600 font-semibold"
                    span={22}
                  >
                    <FaUser className="mr-2" size={15} />
                    Địa điểm:
                    <span className="ml-4 text-black">Đà Nẵng</span>
                  </Col>
                  <Col className="flex justify-center items-center text-green-600 text-md font-bold hover:underline">
                    Xem trang công ty{" "}
                    <BsBoxArrowInUpRight className="ml-2" size={18} />
                  </Col>
                </Row>
              </div>
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

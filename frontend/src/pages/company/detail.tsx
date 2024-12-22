import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ICompany } from "@/types/backend";
import { callFetchCompanyById } from "@/config/api";
import { Breadcrumb, Col, message, Row, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { IoEarth, IoLocationSharp } from "react-icons/io5";
import { FaBuilding, FaRegCopy } from "react-icons/fa";
import { LucidePlus } from "lucide-react";
import linkedin from "../../assets/linkedin_icon.png";
import facebook from "../../assets/facebook_icon.png";
import insta from "../../assets/insta_logo.png";
import tiktok from "../../assets/tiktok_logo.png";

const ClientCompanyDetailPage = (props: any) => {
  const [data, setData] = useState<ICompany | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      if (id) {
        const res = await callFetchCompanyById(id);
        // const res = await callFetchCompanyById("670bd5024c872eb686978a26");
        if (res?.data) {
          setData(res.data);
        }
      }
      setLoading(false);
    };
    fetchCompany();
  }, [id]);

  // console.log("datacompany", data);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy link.");
      });
  };

  const renderSkeleton = () => {
    return (
      <div>
        <Row
          gutter={[10, 10]}
          className="relative text-white border rounded-md"
          style={{
            background: "linear-gradient(to right, #003366, #66ccff)",
            height: "250px",
          }}
        >
          <div className="absolute top-10 left-10 bg-white w-44 h-auto border rounded-full">
            <Skeleton.Avatar className="w-44 h-44 rounded-full" />
          </div>
          <Col
            span={14}
            className="ml-60 p-4 flex justify-between items-end mb-10"
          >
            <div className="text-2xl font-bold">
              <Skeleton />
            </div>
          </Col>
        </Row>

        <Row gutter={[10, 10]} className="mt-6">
          <Col
            span={15}
            className="bg-white border rounded-sm mr-10 p-0 self-start"
          >
            <div
              className="p-2 text-lg text-white font-bold rounded-sm"
              style={{
                background: "linear-gradient(to right, #003366, #66ccff)",
              }}
            >
              Company Introduction
            </div>
            <div className="p-4">
              <Skeleton active={true} />
            </div>
          </Col>

          <Col span={8} className="self-start">
            <div className="bg-white border rounded-md p-0 ">
              <div
                className="p-2 text-lg text-white font-bold rounded-sm"
                style={{
                  background: "linear-gradient(to right, #003366, #66ccff)",
                }}
              >
                Contact information
              </div>
              <div className="p-4 text-md font-semibold">
                <div className="flex items-center mb-2">
                  <Skeleton active={true} />
                </div>
              </div>
            </div>

            <div className="mt-4 bg-white border rounded-md p-0 ">
              <div
                className="p-2 text-lg text-white font-bold rounded-sm"
                style={{
                  background: "linear-gradient(to right, #003366, #66ccff)",
                }}
              >
                Share the company with your friends
              </div>
              <div className="p-4">
                <Skeleton active={true} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <>
      <div className="pt-4 pb-4 pl-40 pr-40 bg-gray-200">
        <Breadcrumb className="text-xl mb-4">
          <Breadcrumb.Item>
            <Link
              style={{ color: "blue", fontWeight: "600" }}
              className="hover:underline"
              to="/company"
            >
              Company List
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link
              style={{ color: "blue", fontWeight: "600" }}
              className="hover:underline"
              to=""
            >
              {data?.name}
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        {loading ? (
          renderSkeleton()
        ) : (
          <>
            <Row
              gutter={[10, 10]}
              className="relative text-white border rounded-md"
              style={{
                background: "linear-gradient(to right, #003366, #66ccff)",
              }}
            >
              <img
                className="w-full h-44 object-cover"
                src="https://wallpapercave.com/wp/wp2963813.jpg"
              />
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${
                  data?.logo
                }`}
                alt={data?.name}
                className="absolute top-20 left-10 bg-white w-44 h-auto border rounded-full object-cover"
              />
              <Col span={14} className="ml-60 p-4">
                <h2 className="text-2xl font-bold">{data?.name}</h2>
                <div className="flex items-center font-semibold">
                  <div className="flex items-center mr-16">
                    <IoEarth size={20} className="mr-2" />
                    {data?.linkUrl || "https://"}
                  </div>
                  <div className="flex items-center">
                    <FaBuilding size={20} className="mr-2" />
                    From {data?.minScale} to {data?.maxScale} employees
                  </div>
                </div>
              </Col>
              <Col span={5} className="flex items-center">
                <button className="bg-white flex items-center text-blue-700 font-semibold border rounded-md p-2 hover:bg-gray-300 ">
                  <LucidePlus className="mr-2" size={20} />
                  Follow the company
                </button>
              </Col>
            </Row>
            <Row gutter={[10, 10]} className="mt-6">
              <Col
                span={15}
                className="bg-white border rounded-sm mr-10 p-0 self-start"
              >
                <div
                  className="p-2 text-lg text-white font-bold rounded-sm"
                  style={{
                    background: "linear-gradient(to right, #003366, #66ccff)",
                  }}
                >
                  Company Introduction
                </div>
                <div
                  className="p-4"
                  dangerouslySetInnerHTML={{
                    __html: data?.description || "",
                  }}
                ></div>
              </Col>
              <Col span={8} className="self-start">
                <div className="bg-white border rounded-md p-0 ">
                  <div
                    className="p-2 text-lg text-white font-bold rounded-sm"
                    style={{
                      background: "linear-gradient(to right, #003366, #66ccff)",
                    }}
                  >
                    Contact information
                  </div>
                  <div className="p-4 text-md font-semibold">
                    <div className="flex items-center mb-2">
                      <IoLocationSharp
                        className="mr-2"
                        size={20}
                        color="blue"
                      />
                      Company address:
                    </div>
                    <span className="ml-2 text-gray-700">{data?.address}</span>
                    <hr className="mt-4 border-gray-400" />
                  </div>
                </div>

                <div className="mt-4 bg-white border rounded-md p-0 ">
                  <div
                    className="p-2 text-lg text-white font-bold rounded-sm"
                    style={{
                      background: "linear-gradient(to right, #003366, #66ccff)",
                    }}
                  >
                    Share the company with your friends
                  </div>
                  <div className="p-4">
                    <div className="font-semibold">Copy link</div>
                    <div className="mt-2 p-2 border rounded-md flex items-center text-gray-500">
                      <span className="truncate">{window.location.href}</span>
                      <button
                        className="p-2 bg-gray-100 hover:bg-gray-300"
                        onClick={handleCopy}
                      >
                        <FaRegCopy size={16} />
                      </button>
                    </div>
                    <div className="mt-2 font-semibold">
                      Share on social media
                    </div>
                    <ul className="mt-2 w-full list-inline">
                      <li className="list-inline-item mx-2">
                        <a href="#">
                          <img src={linkedin} alt="LinkedIn" />
                        </a>
                      </li>
                      <li className="list-inline-item mx-2">
                        <a href="#">
                          <img src={insta} alt="Instagram" />
                        </a>
                      </li>
                      <li className="list-inline-item mx-2">
                        <a href="#">
                          <img src={tiktok} alt="TikTok" />
                        </a>
                      </li>
                      <li className="list-inline-item mx-2">
                        <a href="#">
                          <img src={facebook} alt="Facebook" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
        {/* <Row
          gutter={[10, 10]}
          className="relative text-white border rounded-md"
          style={{ background: "linear-gradient(to right, #003366, #66ccff)" }}
        >
          <img
            className="w-full h-44 object-cover"
            src="https://wallpapercave.com/wp/wp2963813.jpg"
          />
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${
              data?.logo
            }`}
            alt={data?.name}
            className="absolute top-20 left-10 bg-white w-44 h-auto border rounded-full object-cover"
          />
          <Col span={14} className="ml-60 p-4">
            <h2 className="text-2xl font-bold">{data?.name}</h2>
            <div className="flex items-center font-semibold">
              <div className="flex items-center mr-16">
                <IoEarth size={20} className="mr-2" />
                {data?.linkUrl || "https://"} 
              </div>
              <div className="flex items-center">
                <FaBuilding size={20} className="mr-2" />
                From {data?.minScale} to {data?.maxScale} employees
              </div>
            </div>
          </Col>
          <Col span={5} className="flex items-center">
            <button className="bg-white flex items-center text-blue-700 font-semibold border rounded-md p-2 hover:bg-gray-300 ">
              <LucidePlus className="mr-2" size={20} />
              Follow the company
            </button>
          </Col>
        </Row>

        <Row gutter={[10, 10]} className="mt-6">
          <Col
            span={15}
            className="bg-white border rounded-sm mr-10 p-0 self-start"
          >
            <div
              className="p-2 text-lg text-white font-bold rounded-sm"
              style={{
                background: "linear-gradient(to right, #003366, #66ccff)",
              }}
            >
              Company Introduction
            </div>
            <div
              className="p-4"
              dangerouslySetInnerHTML={{
                __html: data?.description || "",
              }}
            ></div>
          </Col>
          <Col span={8} className="self-start">
            <div className="bg-white border rounded-md p-0 ">
              <div
                className="p-2 text-lg text-white font-bold rounded-sm"
                style={{
                  background: "linear-gradient(to right, #003366, #66ccff)",
                }}
              >
                Contact information
              </div>
              <div className="p-4 text-md font-semibold">
                <div className="flex items-center mb-2">
                  <IoLocationSharp className="mr-2" size={20} color="blue" />
                  Company address:
                </div>
                <span className="ml-2 text-gray-700">{data?.address}</span>
                <hr className="mt-4 border-gray-400" />
              </div>
            </div>

            <div className="mt-4 bg-white border rounded-md p-0 ">
              <div
                className="p-2 text-lg text-white font-bold rounded-sm"
                style={{
                  background: "linear-gradient(to right, #003366, #66ccff)",
                }}
              >
                Share the company with your friends
              </div>
              <div className="p-4">
                <div className="font-semibold">Copy link</div>
                <div className="mt-2 p-2 border rounded-md flex items-center text-gray-500">
                  <span className="truncate">{window.location.href}</span>
                  <button
                    className="p-2 bg-gray-100 hover:bg-gray-300"
                    onClick={handleCopy}
                  >
                    <FaRegCopy size={16} />
                  </button>
                </div>
                <div className="mt-2 font-semibold">Share on social media</div>
                <ul className="mt-2 w-full list-inline">
                  <li className="list-inline-item mx-2">
                    <a href="#">
                      <img src={linkedin} alt="LinkedIn" />
                    </a>
                  </li>
                  <li className="list-inline-item mx-2">
                    <a href="#">
                      <img src={insta} alt="Instagram" />
                    </a>
                  </li>
                  <li className="list-inline-item mx-2">
                    <a href="#">
                      <img src={tiktok} alt="TikTok" />
                    </a>
                  </li>
                  <li className="list-inline-item mx-2">
                    <a href="#">
                      <img src={facebook} alt="Facebook" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Row> */}
      </div>
    </>
  );
};
export default ClientCompanyDetailPage;

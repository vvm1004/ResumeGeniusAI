import { AutoComplete, Button, Carousel, Col, Form, Row } from "antd";
import {
  EnvironmentOutlined,
  LeftOutlined,
  MonitorOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { LOCATION_LIST, SKILLS_LIST } from "@/config/utils";
import { ProForm } from "@ant-design/pro-components";
import { FaSearch } from "react-icons/fa";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

interface SearchClientProps {
  showCarousel?: boolean;
  showTitle?: boolean;
}

const removeAccents = (str: string) => {
  return str
    .normalize("NFD") // Chuyển sang dạng Normalization Form D (tách ký tự và dấu)
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
    .replace(/đ/g, "d") // Chuyển "đ" thành "d"
    .replace(/Đ/g, "D") // Chuyển "Đ" thành "D"
    .replace(/\s+/g, "") // Loại bỏ khoảng trắng
    .toUpperCase(); // Chuyển thành chữ in hoa
};

const SearchClient: React.FC<SearchClientProps> = ({
  showCarousel = true,
  showTitle = true,
}) => {
  const [form] = Form.useForm();
  const [filteredSkills, setFilteredSkills] = useState(SKILLS_LIST);
  const [filteredLocations, setFilteredLocations] = useState(LOCATION_LIST);
  const carouselRef = useRef<any>(null);

  const navigate = useNavigate();

  const handleSearch = (value: string, type: "skills" | "locations") => {
    const options = type === "skills" ? SKILLS_LIST : LOCATION_LIST;
    const setFiltered =
      type === "skills" ? setFilteredSkills : setFilteredLocations;

    setFiltered(
      options.filter((option) =>
        option.value.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const onFinish = async ({
    skills,
    locations,
  }: {
    skills: string;
    locations: string;
  }) => {
    const normalizedLocations = removeAccents(locations || "");

    const link = `/jobs?${skills ? `name=/${skills}/i&` : ""}${
      locations ? `location=/${normalizedLocations}/i` : ""
    }`;
    navigate(link);
  };

  const carouselContent = [
    "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/Concentrix_Banner.png",
    "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/Banner 1.png",
    "https://career.fpt-software.com/wp-content/uploads/2020/07/fville-hanoi.jpg",
  ];

  const renderCarousel = () => {
    if (!carouselContent || carouselContent.length === 0) {
      return null;
    }
    return (
      <Row className="relative w-full flex justify-center items-center mt-8 mb-8">
        <Col span={18}>
          <span className="absolute -left-4 bottom-1/2 transform z-10">
            <Button
              onClick={() => carouselRef.current.prev()}
              className="text-white bg-black bg-opacity-50 hover:bg-opacity-75"
              shape="circle"
              icon={<LeftOutlined />}
            />
          </span>
          <span className="absolute -right-4 bottom-1/2 transform z-10">
            <Button
              onClick={() => carouselRef.current.next()}
              className="text-white bg-black bg-opacity-50 hover:bg-opacity-75"
              shape="circle"
              icon={<RightOutlined />}
            />
          </span>
          <Carousel ref={carouselRef} autoplay>
            {carouselContent.map((src, index) => (
              <div key={index} className="relative w-full">
                <img
                  style={{
                    aspectRatio: "10/2",
                    objectFit: "cover",
                    width: "100%",
                    height: "auto",
                    borderRadius: "18px",
                  }}
                  src={src}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            ))}
          </Carousel>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <ProForm
        form={form}
        onFinish={onFinish}
        submitter={{
          render: () => <></>,
        }}
        style={{
          backgroundImage: "url('https://wallpapercave.com/wp/wp2963813.jpg')",
          backgroundSize: "cover",
          objectFit: "cover",
          backgroundRepeat: "no-repeat",
          width: "100%",
          marginRight: "0",
          marginLeft: "0",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Row className="w-full flex justify-center pt-6 pb-6" gutter={[20, 20]}>
          {showTitle && (
            <Col
              span={24}
              className="font-bold text-3xl text-center text-white pt-8"
            >
              <h2>Find jobs fast 24 hours, latest jobs nationwide.</h2>
            </Col>
          )}

          <Col span={10}>
            <ProForm.Item name="skills">
              <AutoComplete
                className="h-12 w-full"
                options={filteredSkills}
                onSearch={(value) => handleSearch(value, "skills")}
                allowClear
                fieldNames={{ label: "label", value: "label" }}
                placeholder={
                  <>
                    <MonitorOutlined /> Job vacancy...
                  </>
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    form.submit();
                  }
                }}
              ></AutoComplete>
            </ProForm.Item>
          </Col>

          <Col span={4}>
            <ProForm.Item name="locations">
              <AutoComplete
                className="h-12 w-full text-lg rounded-full"
                options={filteredLocations}
                onSearch={(value) => handleSearch(value, "locations")}
                allowClear
                fieldNames={{ label: "label", value: "label" }}
                placeholder={
                  <>
                    <EnvironmentOutlined /> Location...
                  </>
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    form.submit();
                  }
                }}
              ></AutoComplete>
            </ProForm.Item>
          </Col>

          <Col span={3}>
            <Button
              className="custome-btn h-12 w-full bg-blue-700 flex justify-center items-center"
              onClick={() => form.submit()}
            >
              <span className="mr-2">
                <FaSearch size={16} />
              </span>
              Search
            </Button>
          </Col>
        </Row>

        {showCarousel && renderCarousel()}
      </ProForm>
    </>
  );
};
export default SearchClient;

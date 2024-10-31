import {
  AutoComplete,
  Button,
  Carousel,
  Col,
  Form,
  Input,
  Row,
  Select,
} from "antd";
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

const contentStyle: React.CSSProperties = {
  aspectRatio: "10/2",
  objectFit: "cover",
  width: "100%",
  height: "auto",
  borderRadius: "18px",
};

interface SearchClientProps {
  showCarousel?: boolean;
  showTitle?: boolean;
}

const SearchClient: React.FC<SearchClientProps> = ({
  showCarousel = true,
  showTitle = true,
}) => {
  const optionsSkills = SKILLS_LIST;
  const optionsLocations = LOCATION_LIST;
  const [form] = Form.useForm();
  const carouselRef = useRef<any>(null);
  const [filteredSkills, setFilteredSkills] = useState(optionsSkills);
  const [filteredLocations, setFilteredLocations] = useState(optionsLocations);
  const navigate = useNavigate();

  const handleSearch = (value: string, type: "skills" | "locations") => {
    if (type === "skills") {
      setFilteredSkills(
        optionsSkills.filter((option) =>
          option.value.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else if (type === "locations") {
      setFilteredLocations(
        optionsLocations.filter((option) =>
          option.value.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const onFinish = async (values: any) => {
    const { skills, locations } = values;

    // const link = `/jobs?name=/${skills}/i&location=/${locations}/i`;
    const link = `/jobs?name=/${skills}/i&location=/${locations}/i`;
    navigate(link);
  };

  const handlePrev = () => {
    carouselRef.current.prev();
  };

  const handleNext = () => {
    carouselRef.current.next();
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
              className="font-bold text-3xl text-center text-green-600 pt-8"
            >
              <h2>Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc.</h2>
            </Col>
          )}

          <Col span={24} md={10}>
            <ProForm.Item name="skills">
              <AutoComplete
                className="h-12 w-full"
                options={filteredSkills}
                onSearch={(value) => handleSearch(value, 'skills')}
                allowClear
                placeholder={
                  <>
                    <MonitorOutlined /> Vị trí tuyển dụng...
                  </>
                }
              >
                {/* <Input /> */}
              </AutoComplete>
            </ProForm.Item>
          </Col>

          <Col span={24} md={4}>
            <ProForm.Item name="locations">
              <AutoComplete
                className="h-12 w-full text-lg rounded-full"
                options={filteredLocations}
                onSearch={(value) => handleSearch(value, 'locations')}
                allowClear
                placeholder={
                  <>
                    <EnvironmentOutlined /> Địa điểm...
                  </>
                }
              >
                {/* <Input/> */}
              </AutoComplete>
            </ProForm.Item>
          </Col>

          <Col span={12} md={3}>
            <Button
              className="custome-btn h-12 w-full bg-green-500 flex justify-center items-center"
              onClick={() => form.submit()}
            >
              <span className="mr-2">
                <FaSearch size={16} />
              </span>
              Search
            </Button>
          </Col>
        </Row>

        {/* <Col span={24} md={10} className="custom-select">
            <ProForm.Item name="skills">
              <Select
                className="text-lg"
                mode="multiple"
                allowClear
                showSearch
                placeholder={
                  <>
                    <MonitorOutlined /> Vị trí tuyển dụng...
                  </>
                }
                optionLabelProp="label"
                options={optionsSkills}
              />
            </ProForm.Item>
          </Col>
          <Col span={12} md={4} className="custom-select">
            <ProForm.Item name="location">
              <Select
                className="text-lg"
                mode="multiple"
                allowClear
                showArrow={false}
                placeholder={
                  <>
                    <EnvironmentOutlined /> Địa điểm...
                  </>
                }
                optionLabelProp="label"
                options={optionsLocations}
              />
            </ProForm.Item>
          </Col> */}

        {showCarousel && (
          <Row className="w-full flex justify-center items-center mt-8 mb-8">
            <Col span={24} md={1} className="mt-6 mb-8">
              <Button
                onClick={handlePrev}
                className="absolute -right-4 transform z-10 text-white bg-black bg-opacity-50 hover:bg-opacity-75"
                shape="circle"
                icon={<LeftOutlined />}
              />
            </Col>
            <Col span={24} md={18} className="">
              <Carousel ref={carouselRef}>
                <div className="w-full">
                  <img
                    style={contentStyle}
                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/Concentrix_Banner.png"
                    alt="Slide 1"
                  />
                </div>
                <div className="w-full">
                  <img
                    style={contentStyle}
                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/Banner 1.png"
                    alt="Slide 2"
                  />
                </div>
                <div className="w-full">
                  <img
                    style={contentStyle}
                    src="https://career.fpt-software.com/wp-content/uploads/2020/07/fville-hanoi.jpg"
                    alt="Slide 2"
                  />
                </div>
              </Carousel>
            </Col>
            <Col span={24} md={1} className="mt-6 mb-8">
              <Button
                onClick={handleNext}
                className="absolute -left-4 transform z-10 text-white bg-black bg-opacity-50 hover:bg-opacity-75"
                shape="circle"
                icon={<RightOutlined />}
              />
            </Col>
          </Row>
        )}
      </ProForm>
    </>
  );
};
export default SearchClient;

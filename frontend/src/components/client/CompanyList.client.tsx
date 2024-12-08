import { callFetchCompany } from "@/config/api";
import { ICompany } from "@/types/backend";
import { message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CompanyList = () => {
  const [company, setCompany] = useState<ICompany[] | null>(null);

  const navigate = useNavigate();

  const fetchCompany = useCallback(async () => {
    const query = "";

    try {
      const res = await callFetchCompany(query);
      if (res?.data) {
        setCompany(res.data.result);
      }
    } catch (error) {
      message.error("Error loading job data!");
    }
  }, []);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const generateRandomTransform = (index: number, totalItems: number) => {
    const containerWidth = 100; // Chiều rộng container (đơn vị %)
    const itemSize = 20; // Kích thước của mỗi item (đơn vị %)
    const padding = 2; // Khoảng cách giữa các item (đơn vị %)

    // Số cột tối đa trong một hàng
    const maxColumns = Math.floor(containerWidth / (itemSize + padding));
    // Vị trí hàng và cột
    const colIndex = index % maxColumns; // Cột hiện tại
    const rowIndex = Math.floor(index / maxColumns); // Hàng hiện tại

    // Tính toán vị trí của item
    const x = colIndex * (itemSize + padding); // Vị trí ngang
    const y = rowIndex * (itemSize + padding); // Vị trí dọc

    // Scale ngẫu nhiên trong khoảng từ 0.8 đến 1.2
    const scale = 0.6 + Math.random() * 0.6;

    return {
      transform: `translate(${x}%, ${y}%) scale(${scale})`,
    };
  };

  console.log("dataCompany", company);

  const handleClick = (name: any, id: any) => {
    return () => {
      navigate(`/company/${name}?id=${id}`);
    };
  };

  const generateMovingItems = () => {
    if (!company) return null;
    const items = [...company, ...company];
    return items.map((comp, index) => (
      <div
        className="company-items"
        key={index}
        style={generateRandomTransform(index, items.length)}
      >
        <div className="company-items-wrapper">
          <div
            className="company-item"
            onClick={handleClick(comp.name, comp._id)}
          >
            <img
              className="company-logo"
              src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${
                comp?.logo
              }`}
              alt={comp.name}
            />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="company-marquee">{generateMovingItems()}</div>
    </>
  );
};

export default CompanyList;

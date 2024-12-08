import { Pagination, Table } from "antd";
import { useState, useEffect } from "react";
import { callFetchResumeByUser } from "@/config/api";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const SpreadCV = () => {
  const [listCV, setListCV] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();

  const fetchCV = async () => {
    setIsFetching(true);
    const res = await callFetchResumeByUser();
    if (res && res.data) {
      setListCV(res.data);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    fetchCV();
  }, []);

  const columns = [
    {
      title: "STT",
      key: "index",
      width: "5%",
      align: "center",
      render: (text, record, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: "Company",
      dataIndex: ["companyId", "name"],
    },
    {
      title: "Position",
      dataIndex: ["jobId", "name"],
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "CV distribution day",
      dataIndex: "createdAt",
      render(value, record) {
        return <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
    },
    {
      title: "",
      dataIndex: "",
      render: (value, record) => {
        return record?.typeUrl === "urlCV" ? (
          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/images/resume/${
              record?.url
            }`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ cursor: "pointer", color: "blue" }}
          >
            Xem Chi tiết
          </a>
        ) : (
          <a
            onClick={() => navigate(`/resumes/view/${record?.url}`)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Xem chi tiết
          </a>
        );
      },
    },
  ];

  return (
    <>
      <div className="p-8">
        <h2 className="mb-8 text-blue-600 text-3xl font-bold">Spread CV</h2>
        <Table
          columns={columns}
          dataSource={listCV}
          loading={isFetching}
          pagination={{
            pageSize: 10, // Số mục hiển thị trên mỗi trang
            showSizeChanger: false, // Hiển thị tùy chọn thay đổi số mục trên trang
            // pageSizeOptions: ["5", "10", "20"], // Các lựa chọn số mục trên trang
          }}
          // virtual scroll={{ x: 2000, y: 500 }}
        />
      </div>
    </>
  );
};

export default SpreadCV;

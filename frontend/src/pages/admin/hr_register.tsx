import React, { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import DataTable from "@/components/client/data-table";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Space, Tag, message, notification, Tooltip } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import queryString from "query-string";
import { callUpdateHrRegister } from "@/config/api";
import { fetchHr } from "@/redux/slice/hrRegistrationSlide";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

const HrRegistrationPage = () => {
  const tableRef = useRef<ActionType>();
  const dispatch = useAppDispatch();

  const {
    isFetching,
    meta,
    result: hrRegistrations,
  } = useAppSelector((state) => state.hrRegistration);
  console.log(hrRegistrations);
  const handleApproveReject = async (
    action: "approved" | "rejected",
    id: string | undefined,
    record: any
  ) => {
    if (!id) return;

    const updateStatus = {
      ...record,
      status: action,
    };

    try {
      const res = await callUpdateHrRegister(id, updateStatus);
      if (res?.data) {
        message.success(
          `${action === "approved" ? "Duyệt" : "Từ chối"} thành công!`
        );
        tableRef?.current?.reload();
      } else {
        notification.error({
          message: "Lỗi cập nhật trạng thái",
          description: res?.message || "Không thể cập nhật trạng thái.",
        });
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi cập nhật trạng thái.");
    }
  };

  const buildQuery = (params: any, sort: any) => {
    const query = { ...params };
    let queryStr = queryString.stringify(query);
    const sortField = sort?.createdAt || sort?.updatedAt;
    const sortBy = sortField
      ? `sort=${sortField === "ascend" ? "" : "-"}${sortField}`
      : "sort=-updatedAt";

    return `${queryStr}&${sortBy}`;
  };

  const columns: ProColumns<any>[] = [
    {
      title: "ID",
      dataIndex: "_id",
      width: 200,
      hideInSearch: true,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Họ và Tên",
      dataIndex: "fullName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Tuổi",
      dataIndex: "age",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => {
        const statusColor =
          record.status === "approved"
            ? "green"
            : record.status === "rejected"
              ? "red"
              : "lime";
        return (
          <Tag color={statusColor}>
            {record.status?.toUpperCase() || "PENDING"}
          </Tag>
        );
      },
      hideInSearch: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (_, record) =>
        dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss"),
      hideInSearch: true,
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Tooltip title="Duyệt">
            <CheckOutlined
              style={{ fontSize: 18, color: "green", cursor: "pointer" }}
              onClick={() =>
                handleApproveReject("approved", record._id, record)
              }
            />
          </Tooltip>
          <Tooltip title="Từ chối">
            <CloseOutlined
              style={{ fontSize: 18, color: "red", cursor: "pointer" }}
              onClick={() =>
                handleApproveReject("rejected", record._id, record)
              }
            />
          </Tooltip>
        </Space>
      ),
      hideInSearch: true,
    },
  ];

  return (
    <div>
      <Access permission={ALL_PERMISSIONS.HR_REGISTRATION.GET_PAGINATE}>
        <DataTable
          actionRef={tableRef}
          headerTitle="Danh sách đăng ký HR"
          rowKey="_id"
          loading={isFetching}
          columns={columns}
          dataSource={hrRegistrations}
          request={async (params, sort, filter) => {
            const query = buildQuery(params, sort);
            await dispatch(fetchHr({ query })); // Gọi API và cập nhật Redux state

            return {
              data: hrRegistrations || [], // Dữ liệu từ Redux
              success: true,
              total: meta?.total || 0,
            };
          }}
          pagination={{
            current: meta.current || 1, // Gán giá trị mặc định nếu current là null
            pageSize: meta.pageSize,
            total: meta.total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} hàng`,
          }}
          rowSelection={false}
        />
      </Access>
    </div>
  );
};

export default HrRegistrationPage;

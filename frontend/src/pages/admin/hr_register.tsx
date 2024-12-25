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

  const isFetching = useAppSelector((state) => state.hrRegistration.isFetching);
  const meta = useAppSelector((state) => state.hrRegistration.meta);
  const hrRegistrations = useAppSelector(
    (state) => state.hrRegistration.result
  );

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
          `${action === "approved" ? "Approved" : "Rejected"} successfully!`
        );
        tableRef?.current?.reload();
      } else {
        notification.error({
          message: "Error updating status",
          description: res?.message || "Unable to update status.",
        });
      }
    } catch (error) {
      message.error("An error occurred while updating the status.");
    }
  };

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = { ...params };
    if (clone.name) clone.name = `/${clone.name}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

    // Default sort by updatedAt
    if (Object.keys(sortBy).length === 0) {
      temp = `${temp}&sort=-updatedAt`;
    } else {
      temp = `${temp}&${sortBy}`;
    }

    return temp;
  };

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const columns: ProColumns<any>[] = [
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Status",
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
      title: "Company",
      dataIndex: "company",
      render: (_, record) => {
        return record.company?.name || "N/A"; // Display company name or "N/A"
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (_, record) =>
        dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss"),
      hideInSearch: true,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Approve">
            <CheckOutlined
              style={{ fontSize: 18, color: "green", cursor: "pointer" }}
              onClick={() =>
                handleApproveReject("approved", record._id, record)
              }
            />
          </Tooltip>
          <Tooltip title="Reject">
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
          headerTitle="HR Registration List"
          rowKey="_id"
          loading={isFetching}
          columns={columns}
          dataSource={hrRegistrations}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter);
            dispatch(fetchHr({ query })); // Call API and update Redux state
          }}
          scroll={{ x: true }}
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            showSizeChanger: true,
            total: meta.total,
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]}-{range[1]} of {total} rows
                </div>
              );
            },
          }}
          rowSelection={false}
        />
      </Access>
    </div>
  );
};

export default HrRegistrationPage;

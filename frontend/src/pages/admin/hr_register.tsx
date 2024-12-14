import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IHrRegistration } from "@/types/backend";
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space, Tag, message, notification } from "antd";
import { useState, useRef } from "react";
import dayjs from "dayjs";
import { callDeleteHrRegister, callUpdateHrRegister } from "@/config/api";
import queryString from "query-string";
import { fetchHr, fetchHrById } from "@/redux/slice/hrRegistrationSlide";
import ModalHrRegistration from "@/components/admin/hr_registration/modal.registration";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

const HrRegistrationPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const tableRef = useRef<ActionType>();
  const isFetching = useAppSelector((state) => state.hrRegistration.isFetching);
  const meta = useAppSelector((state) => state.hrRegistration.meta);
  const hrRegistrations = useAppSelector(
    (state) => state.hrRegistration.result
  );
  const singleHrRegistration = useAppSelector(
    (state) => state.hrRegistration.singleHrRegistration
  );
  const dispatch = useAppDispatch();

  // const handleDeleteHrRegistration = async (_id: string | undefined) => {
  //   if (_id) {
  //     const res = await callDeleteHrRegister(_id);
  //     if (res && res.data) {
  //       message.success("Xóa HR Registration thành công");
  //       reloadTable();
  //     } else {
  //       notification.error({
  //         message: "Có lỗi xảy ra",
  //         description: res.message,
  //       });
  //     }
  //   }
  // };
  // console.log(hrRegistrations); // Kiểm tra xem dữ liệu có trường _id hay không

  const handleApproveReject = async (
    action: string,
    _id: string | undefined,
    userId: string | undefined,
    email: string | undefined
  ) => {
    if (_id) {
      // Cập nhật trạng thái (approved hoặc rejected)
      const updatedHrRegistration: IHrRegistration = {
        status: action === "approved" ? "approved" : "rejected",
        updatedBy: {
          userId: userId,
          email: email,
        },
      };

      try {
        // Gọi API để cập nhật trạng thái HR Registration
        await callUpdateHrRegister(_id, updatedHrRegistration);

        // Hiển thị thông báo thành công
        message.success(
          `${
            action === "approved" ? "Duyệt" : "Từ chối"
          } HR Registration thành công`
        );

        // Tải lại bảng dữ liệu sau khi cập nhật
        reloadTable();
      } catch (error) {
        message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
      }
    }
  };

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const columns: ProColumns<IHrRegistration>[] = [
    {
      title: "Id",
      dataIndex: "_id",
      width: 250,
      render: (text, record) => <span>{record._id}</span>,
      hideInSearch: true,
    },
    {
      title: "Company",
      dataIndex: "company",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render(text, record) {
        const status = record.status || "pending"; // Giả sử 'pending' là giá trị mặc định
        let statusColor = "lime"; // Mặc định là màu lime (xanh lá) cho 'pending'

        if (status === "approved") {
          statusColor = "green";
        } else if (status === "rejected") {
          statusColor = "red";
        }

        return <Tag color={statusColor}>{status.toUpperCase()}</Tag>;
      },
      hideInSearch: true,
    },

    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      width: 200,
      sorter: true,
      render: (text, record) => (
        <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>
      ),
      hideInSearch: true,
    },
    // {
    //   title: "UpdatedAt",
    //   dataIndex: "updatedAt",
    //   width: 200,
    //   sorter: true,
    //   render: (text, record) => (
    //     <>{dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</>
    //   ),
    //   hideInSearch: true,
    // },
    {
      title: "Actions",
      hideInSearch: true,
      width: 50,
      render: (_value, entity) => (
        <Space>
          <div className="flex items-center align-middle">
            <Access
              permission={ALL_PERMISSIONS.HR_REGISTRATION.UPDATE}
              hideChildren
            >
              <span
                style={{ cursor: "pointer", margin: "0 10px" }}
                onClick={() =>
                  handleApproveReject(
                    "approved",
                    entity._id,
                    entity.userId,
                    entity.email
                  )
                }
              >
                <CheckOutlined style={{ fontSize: 20, color: "#68f74f" }} />
              </span>
              <span
                style={{ cursor: "pointer", margin: "0 10px" }}
                onClick={() =>
                  handleApproveReject(
                    "rejected",
                    entity._id,
                    entity.userId,
                    entity.email
                  )
                }
              >
                <CloseOutlined style={{ fontSize: 20, color: "#eb4444" }} />
              </span>
            </Access>

            {/* <Access
              permission={ALL_PERMISSIONS.HR_REGISTRATION.DELETE}
              hideChildren
            >
              <Popconfirm
                placement="leftTop"
                title={"Xác nhận xóa HR Registration"}
                description={"Bạn có chắc chắn muốn xóa HR Registration này?"}
                // onConfirm={() => handleDeleteHrRegistration(entity._id)}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <span style={{ cursor: "pointer", margin: "0 10px" }}>
                  <DeleteOutlined style={{ fontSize: 20, color: "#ff4d4f" }} />
                </span>
              </Popconfirm>
            </Access> */}
          </div>
        </Space>
      ),
    },
  ];

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = { ...params };
    if (clone.company) clone.company = `/${clone.company}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.company) {
      sortBy = sort.company === "ascend" ? "sort=company" : "sort=-company";
    }
    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

    // Mặc định sort theo updatedAt
    if (Object.keys(sortBy).length === 0) {
      temp = `${temp}&sort=-updatedAt`;
    } else {
      temp = `${temp}&${sortBy}`;
    }

    return temp;
  };

  return (
    <div>
      <Access permission={ALL_PERMISSIONS.HR_REGISTRATION.GET_PAGINATE}>
        <DataTable<IHrRegistration>
          actionRef={tableRef}
          headerTitle="Danh sách HR Registrations"
          rowKey="_id"
          loading={isFetching}
          columns={columns}
          dataSource={hrRegistrations}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter);
            dispatch(fetchHr({ query }));
            // setOpenModal(true);
          }}
          scroll={{ x: true }}
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            showSizeChanger: true,
            total: meta.total,
            showTotal: (total, range) => (
              <div>
                {range[0]}-{range[1]} trên {total} rows
              </div>
            ),
          }}
          rowSelection={false}
          toolBarRender={() => [
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setOpenModal(true)}
            >
              Thêm mới
            </Button>,
          ]}
        />
      </Access>
      {/* {selectedId && (
        <ModalHrRegistration
          openModal={openModal}
          setOpenModal={setOpenModal}
          selectedId={selectedId}
          reloadTable={reloadTable}
        />
      )} */}
    </div>
  );
};

export default HrRegistrationPage;

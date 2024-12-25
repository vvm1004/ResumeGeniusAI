import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IResume } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { Button, Popconfirm, Select, Space, Tag, message, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callDeleteResume } from "@/config/api";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";
import { fetchAdminResume } from "@/redux/slice/resumeSlideAdmin"
import ViewDetailResume from "@/components/admin/resume/view.resume";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";

const ResumePage = () => {
    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.adminResume.isFetching);
    const meta = useAppSelector(state => state.adminResume.meta);
    const resumes = useAppSelector(state => state.adminResume.result);
    const dispatch = useAppDispatch();

    const [dataInit, setDataInit] = useState<IResume | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleDeleteResume = async (_id: string | undefined) => {
        if (_id) {
            const res = await callDeleteResume(_id);
            if (res && res.data) {
                message.success('Xóa Resume thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IResume>[] = [
        {
            title: 'Id',
            dataIndex: '_id',
            width: 250,
            render: (text, record, index, action) => {
                return (
                    <>{record._id}</>
                );
            },
            hideInSearch: true,
        },

        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            sorter: true,
            renderFormItem: (item, props, form) => (
                <ProFormSelect
                    showSearch
                    mode="multiple"
                    allowClear
                    valueEnum={{
                        PENDING: 'PENDING',
                        REVIEWING: 'REVIEWING',
                        APPROVED: 'APPROVED',
                        REJECTED: 'REJECTED',
                    }}
                    placeholder="Chọn level"
                />
            ),
        },

        {
            title: 'Job',
            dataIndex: 'jobId',
            render: (text, record) => {
                // Kiểm tra xem jobId có phải là đối tượng hay không
                const job = record?.jobId;
                if (typeof job === 'string') {
                    return 'N/A'; // Nếu là chuỗi (ID), trả về 'N/A' hoặc ID nếu bạn muốn
                }
                // Nếu jobId là một đối tượng, trả về tên công việc
                return job?.name || 'N/A';
            }
        },
        
        {
            title: 'Company',
            dataIndex: ["companyId", "name"],
            hideInSearch: true,
        },
        {
            title: "CV",
            dataIndex: "",
            render: (value, record) => {
                return record?.typeUrl === "urlCV" ? (
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/images/resume/${record?.url
                            }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ cursor: "pointer", color: "blue" }}
                    >
                        View CV
                    </a>
                ) : (
                    <a
                        onClick={() => navigate(`/resumes/view/${record?.url}`)}
                        style={{ cursor: "pointer", color: "blue" }}
                    >
                        View CV
                    </a>
                );
            },
        },

        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 100, // Điều chỉnh độ rộng của cột nếu cần
            render: (_value, entity, _index, _action) => (
                <Space>
                    {/* Nút Chỉnh Sửa */}
                    <Access
                        permission={ALL_PERMISSIONS.RESUMES.UPDATE} // Kiểm tra quyền chỉnh sửa resume
                        hideChildren
                    >
                        <span
                            style={{ cursor: "pointer", margin: "0 10px" }}
                            onClick={() => {
                                setOpenViewDetail(true); // Mở modal chỉnh sửa
                                setDataInit(entity); // Đưa dữ liệu của resume vào modal
                            }}
                        >
                            <EditOutlined
                                style={{
                                    fontSize: 20,
                                    color: '#ffa500', // Màu sắc của nút chỉnh sửa
                                }}
                            />
                        </span>
                    </Access>

                    {/* Nút Xóa */}
                    <Access
                        permission={ALL_PERMISSIONS.RESUMES.DELETE} // Kiểm tra quyền xóa resume
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa resume"}
                            description={"Bạn có chắc chắn muốn xóa resume này?"}
                            onConfirm={() => handleDeleteResume(entity._id)} // Xử lý xóa resume
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 20,
                                        color: '#ff4d4f', // Màu sắc của nút xóa
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        }


    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        // if (clone.name) clone.name = `/${clone.name}/i`;
        // if (clone.salary) clone.salary = `/${clone.salary}/i`;
        if (clone?.status?.length) {
            clone.status = clone.status.join(",");
        }

            
        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.status) {
            sortBy = sort.status === 'ascend' ? "sort=status" : "sort=-status";
        }

        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt" : "sort=-createdAt";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt" : "sort=-updatedAt";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=-updatedAt`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        temp += "&populate=companyId,jobId&fields=companyId._id, companyId.name, companyId.logo, jobId._id, jobId.name";
        return temp;
    }

    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.RESUMES.GET_PAGINATE}
            >
                <DataTable<IResume>
                    actionRef={tableRef}
                    headerTitle="Danh sách Resumes"
                    rowKey="_id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={resumes}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchAdminResume({ query }))
                    }}
                    scroll={{ x: true }}
                    pagination={
                        {
                            current: meta.current,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: meta.total,
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                        }
                    }
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <></>
                        );
                    }}
                />
            </Access>
            <ViewDetailResume
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
            />
        </div>
    )
}

export default ResumePage;
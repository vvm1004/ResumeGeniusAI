import ModalCompany from "@/components/admin/company/modal.company";
import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCompany } from "@/redux/slice/companySlide";
import { ICompany } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callDeleteCompany } from "@/config/api";
import queryString from 'query-string';
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

const CompanyPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<ICompany | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.company.isFetching);
    const meta = useAppSelector(state => state.company.meta);
    const companies = useAppSelector(state => state.company.result);
    const dispatch = useAppDispatch();


    const handleDeleteCompany = async (_id: string | undefined) => {
        if (_id) {
            const res = await callDeleteCompany(_id);
            if (res && res.data) {
                message.success('Delete Company Successfully');
                reloadTable();
            } else {
                notification.error({
                    message: 'An error occurred.',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<ICompany>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1) + (meta.current - 1) * (meta.pageSize)}
                    </> 
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            width: 200,
            render: (text, record, index, action) => {
                return (
                    <span>
                        {record._id}
                    </span>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Address',
            width: 200,
            dataIndex: 'address',
            sorter: true,
        },
        {
            title: 'Link URL',
            dataIndex: 'linkUrl',
            render: (text) => (
                <span>{text}</span> 
            ),
            hideInSearch: true,
        },
        {
            title: 'Company size',
            width: 200,
            sorter: (a, b) => {
                const minScaleA = a.minScale || 0;
                const minScaleB = b.minScale || 0;
                return minScaleA - minScaleB; 
            },            
            render: (_, record) => (
                <>{record.minScale} - {record.maxScale} staff</>
            ),
            hideInSearch: true,
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record) => {
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
            render: (text, record) => {
                return (
                    <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 50,
            render: (_value, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.COMPANIES.UPDATE} hideChildren>
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            onClick={() => {
                                setOpenModal(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.COMPANIES.DELETE} hideChildren>
                        <Popconfirm
                            placement="leftTop"
                            title={"Confirm company deletion"}
                            description={"Are you sure you want to delete this company ?"}
                            onConfirm={() => handleDeleteCompany(entity._id)}
                            okText="Confirm"
                            cancelText="Cancel"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 20,
                                        color: '#ff4d4f',
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];
    
    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        if (clone.name) clone.name = `/${clone.name}/i`;
        if (clone.address) clone.address = `/${clone.address}/i`;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name" : "sort=-name";
        }
        if (sort && sort.address) {
            sortBy = sort.address === 'ascend' ? "sort=address" : "sort=-address";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt" : "sort=-createdAt";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt" : "sort=-updatedAt";
        }
        if (sort && sort.minScale) { // Thêm logic cho minScale
            sortBy = sort.minScale === 'ascend' ? "sort=minScale" : "sort=-minScale";
        }
        if (sort && sort.maxScale) { // Thêm logic cho maxScale
            sortBy = sort.maxScale === 'ascend' ? "sort=maxScale" : "sort=-maxScale";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=-updatedAt`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }

    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.COMPANIES.GET_PAGINATE}
            >
                <DataTable<ICompany>
                    actionRef={tableRef}
                    headerTitle="Company List"
                    rowKey="_id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={companies}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchCompany({ query }))
                    }}
                    scroll={{ x: true }}
                    pagination={
                        {
                            current: meta.current,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: meta.total,
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} of {total} rows</div>) }
                        }
                    }
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Access
                                permission={ALL_PERMISSIONS.COMPANIES.CREATE}
                                hideChildren
                            >
                                <Button
                                    icon={<PlusOutlined />}
                                    type="primary"
                                    onClick={() => setOpenModal(true)}
                                >
                                    Add new
                                </Button>
                            </Access>
                        );
                    }}
                />
            </Access>
            <ModalCompany
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    )
}

export default CompanyPage;
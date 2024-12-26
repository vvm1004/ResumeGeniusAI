import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateUser, callFetchCompany, callFetchRole, callUpdateUser } from "@/config/api";
import { IUser } from "@/types/backend";
import { DebounceSelect } from "./debouce.select";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IUser | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

export interface ICompanySelect {
    label: string;
    value: string;
    key?: string;
}

const ModalUser = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [companies, setCompanies] = useState<ICompanySelect[]>([]);
    const [roles, setRoles] = useState<ICompanySelect[]>([]);

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?._id) {
            if (dataInit.company) {
                setCompanies([{
                    label: dataInit.company.name,
                    value: dataInit.company._id,
                    key: dataInit.company._id,
                }])
            }
            if (dataInit.role) {
                setRoles([
                    {
                        label: dataInit.role?.name,
                        value: dataInit.role?._id,
                        key: dataInit.role?._id,
                    }
                ])
            }
        }
    }, [dataInit]);

    const submitUser = async (valuesForm: any) => {
        const { name, email, password, address, age, gender, role, company } = valuesForm;
        if (dataInit?._id) {
            //update
            const user = {
                _id: dataInit._id,
                name,
                email,
                password,
                age,
                gender,
                address,
                role: role.value,
                company: {
                    _id: company.value,
                    name: company.label
                }
            }

            const res = await callUpdateUser(user);
            if (res.data) {
                message.success("User update successful");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'An error occurred.',
                    description: res.message
                });
            }
        } else {
            //create
            const user = {
                name,
                email,
                password,
                age,
                gender,
                address,
                role: role.value,
                company: {
                    _id: company.value,
                    name: company.label
                }
            }
            const res = await callCreateUser(user);
            if (res.data) {
                message.success("New user added successfully");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'An error occurred.',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setCompanies([]);
        setRoles([]);
        setOpenModal(false);
    }

    // Usage of DebounceSelect
    async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchCompany(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            return temp;
        } else return [];
    }

    async function fetchRoleList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchRole(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            return temp;
        } else return [];
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?._id ? "Update User" : "Create new User"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?._id ? "Update" : "Create new"}</>,
                    cancelText: "Cancel"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitUser}
                initialValues={dataInit?._id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please do not leave blank' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                            placeholder="Enter email"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText.Password
                            disabled={dataInit?._id ? true : false}
                            label="Password"
                            name="password"
                            rules={[{ required: dataInit?._id ? false : true, message: 'Please do not leave blank' }]}
                            placeholder="Enter password"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormText
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please do not leave blank' }]}
                            placeholder="Enter Name"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormDigit
                            label="Age"
                            name="age"
                            rules={[{ required: true, message: 'Please do not leave blank' }]}
                            placeholder="Enter age"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormSelect
                            name="gender"
                            label="Gender"
                            valueEnum={{
                                MALE: 'Male',
                                FEMALE: 'Female',
                                OTHER: 'Other',
                            }}
                            placeholder="Please select a gender"
                            rules={[{ required: true, message: 'Please select gender!' }]}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProForm.Item
                            name="role"
                            label="Role"
                            rules={[{ required: true, message: 'Please select a role!' }]}

                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={roles}
                                value={roles}
                                placeholder="Select role"
                                fetchOptions={fetchRoleList}
                                onChange={(newValue: any) => {
                                    if (newValue?.length === 0 || newValue?.length === 1) {
                                        setRoles(newValue as ICompanySelect[]);
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>

                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="company"
                            label="Belong to Company"
                            rules={[{ required: true, message: 'Please select company!' }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={companies}
                                value={companies}
                                placeholder="Select company"
                                fetchOptions={fetchCompanyList}
                                onChange={(newValue: any) => {
                                    if (newValue?.length === 0 || newValue?.length === 1) {
                                        setCompanies(newValue as ICompanySelect[]);
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>

                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please do not leave blank' }]}
                            placeholder="Enter address"
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalUser;

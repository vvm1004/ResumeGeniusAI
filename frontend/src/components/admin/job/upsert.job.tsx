import { Breadcrumb, Col, ConfigProvider, Divider, Form, Row, message, notification } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DebounceSelect } from "../user/debouce.select";
import { FooterToolbar, ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import styles from 'styles/admin.module.scss';
import { LOCATION_LIST, SKILLS_LIST } from "@/config/utils";
import { ICompanySelect } from "../user/modal.user";
import { useState, useEffect } from 'react';
import { callCreateJob, callFetchCompany, callFetchCompanyAdmin, callFetchJobById, callUpdateJob, callSendNewJob } from "@/config/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CheckSquareOutlined } from "@ant-design/icons";
import enUS from 'antd/lib/locale/en_US';
import dayjs from 'dayjs';
import { IJob } from "@/types/backend";

const ViewUpsertJob = (props: any) => {
    const [companies, setCompanies] = useState<ICompanySelect[]>([]);

    const navigate = useNavigate();
    const [value, setValue] = useState<string>("");

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id
    const [dataUpdate, setDataUpdate] = useState<IJob | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const init = async () => {
            if (id) {
                const res = await callFetchJobById(id);
                if (res && res.data) {
                    setDataUpdate(res.data);
                    setValue(res.data.description);
                    setCompanies([
                        {
                            label: res.data.company?.name as string,
                            value: `${res.data.company?._id}@#$${res.data.company?.logo}` as string,
                            key: res.data.company?._id
                        }
                    ])

                    form.setFieldsValue({
                        ...res.data,
                        company: {
                            label: res.data.company?.name as string,
                            value: `${res.data.company?._id}@#$${res.data.company?.logo}` as string,
                            key: res.data.company?._id
                        },

                    })
                }
            }
        }
        init();
        return () => form.resetFields()
    }, [id])

    // Usage of DebounceSelect
    async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchCompanyAdmin(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: `${item._id}@#$${item.logo}` as string
                }
            })
            return temp;
        } else return [];
    }

    const onFinish = async (values: any) => {
        if (dataUpdate?._id) {
            //update
            const cp = values?.company?.value?.split('@#$');
            const job = {
                name: values.name,
                skills: values.skills,
                company: {
                    _id: cp && cp.length > 0 ? cp[0] : "",
                    name: values.company.label,
                    logo: cp && cp.length > 1 ? cp[1] : ""
                },
                location: values.location,
                salary: values.salary,
                quantity: values.quantity,
                level: values.level,
                description: value,
                startDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.startDate) ? dayjs(values.startDate, 'DD/MM/YYYY').toDate() : values.startDate,
                endDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.endDate) ? dayjs(values.endDate, 'DD/MM/YYYY').toDate() : values.endDate,
                isActive: values.isActive
            }

            const res = await callUpdateJob(job, dataUpdate._id);
            if (res.data) {
                message.success("Job update successful");
                navigate('/admin/job')
            } else {
                notification.error({
                    message: 'An error occurred.',
                    description: res.message
                });
            }
        } else {
            //create
            const cp = values?.company?.value?.split('@#$');
            const job = {
                name: values.name,
                skills: values.skills,
                company: {
                    _id: cp && cp.length > 0 ? cp[0] : "",
                    name: values.company.label,
                    logo: cp && cp.length > 1 ? cp[1] : ""
                },
                location: values.location,
                salary: values.salary,
                quantity: values.quantity,
                level: values.level,
                description: value,
                startDate: dayjs(values.startDate, 'DD/MM/YYYY').toDate(),
                endDate: dayjs(values.endDate, 'DD/MM/YYYY').toDate(),
                isActive: values.isActive
            }

            const res = await callCreateJob(job);
            if (res.data) {
                message.success("New job created successfully");
                if (res.data && res.data._id) {
                    const res2 = await callSendNewJob(res.data._id);
                    message.success("Job sent successfully");
                    console.log("Job sent successfully", res2)
                } else {
                    console.error("Job ID is missing or undefined");
                }

                navigate('/admin/job')
            } else {
                notification.error({
                    message: 'An error occurred.',
                    description: res.message
                });
            }
        }
    }



    return (
        <div className={styles["upsert-job-container"]}>
            <div className={styles["title"]}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to="/admin/job">Manage Job</Link>,
                        },
                        {
                            title: 'Upsert Job',
                        },
                    ]}
                />
            </div>
            <div >

                <ConfigProvider locale={enUS}>
                    <ProForm
                        form={form}
                        onFinish={onFinish}
                        submitter={
                            {
                                searchConfig: {
                                    resetText: "Cancel",
                                    submitText: <>{dataUpdate?._id ? "Update Job" : "Create new Job"}</>
                                },
                                onReset: () => navigate('/admin/job'),
                                render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                                submitButtonProps: {
                                    icon: <CheckSquareOutlined />
                                },
                            }
                        }
                    >
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={12}>
                                <ProFormText
                                    label="Job Name"
                                    name="name"
                                    rules={[
                                        { required: true, message: 'Please do not leave blank' },
                                    ]}
                                    placeholder="Enter job name"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="skills"
                                    label="Required Skills"
                                    options={SKILLS_LIST}
                                    placeholder="You can enter or select a skill"
                                    rules={[{ required: true, message: 'Please enter or select a skill!' }]}
                                    allowClear
                                    // mode="multiple"
                                    mode="tags"
                                    fieldProps={{
                                        showArrow: false
                                    }}

                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="location"
                                    label="Location"
                                    // options={LOCATION_LIST.filter(item => item.value !== 'ALL')}
                                    options={LOCATION_LIST.filter(item => item.value !== 'ALL')}
                                    placeholder="Please select a location"
                                    rules={[{ required: true, message: 'Please select a location!' }]}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Salary"
                                    name="salary"
                                    rules={[{ required: true, message: 'Please do not leave blank' }]}
                                    placeholder="Enter salary"
                                    fieldProps={{
                                        addonAfter: " đ",
                                        formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                        parser: (value) => +(value || '').replace(/\$\s?|(,*)/g, '')
                                    }}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Quantity"
                                    name="quantity"
                                    rules={[{ required: true, message: 'Please do not leave blank' }]}
                                    placeholder="Enter quantity"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="level"
                                    label="Level"
                                    valueEnum={{
                                        INTERN: 'INTERN',
                                        FRESHER: 'FRESHER',
                                        JUNIOR: 'JUNIOR',
                                        MIDDLE: 'MIDDLE',
                                        SENIOR: 'SENIOR',
                                    }}
                                    placeholder="Please select a level"
                                    rules={[{ required: true, message: 'Please select level!' }]}
                                />
                            </Col>

                            {(dataUpdate?._id || !id) &&
                                <Col span={24} md={6}>
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
                            }

                        </Row>
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={6}>
                                <ProFormDatePicker
                                    label="Start date"
                                    name="startDate"
                                    normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                                    fieldProps={{
                                        format: 'DD/MM/YYYY',

                                    }}
                                    rules={[{ required: true, message: 'Please select date of issue' }]}
                                    placeholder="dd/mm/yyyy"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDatePicker
                                    label="End date"
                                    name="endDate"
                                    normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                                    fieldProps={{
                                        format: 'DD/MM/YYYY',

                                    }}
                                    // width="auto"
                                    rules={[{ required: true, message: 'Please select date of issue' }]}
                                    placeholder="dd/mm/yyyy"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSwitch
                                    label="Status"
                                    name="isActive"
                                    checkedChildren="ACTIVE"
                                    unCheckedChildren="INACTIVE"
                                    initialValue={true}
                                    fieldProps={{
                                        defaultChecked: true,
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <ProForm.Item
                                    name="description"
                                    label="Job description"
                                    rules={[{ required: true, message: 'Please enter job description!' }]}
                                >
                                    <ReactQuill
                                        theme="snow"
                                        value={value}
                                        onChange={setValue}
                                    />
                                </ProForm.Item>
                            </Col>
                        </Row>
                        <Divider />
                    </ProForm>
                </ConfigProvider>

            </div>
        </div>
    )
}

export default ViewUpsertJob;
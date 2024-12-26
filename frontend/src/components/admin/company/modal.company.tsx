import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { FooterToolbar, ModalForm, ProCard, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, ConfigProvider, Form, InputNumber, Modal, Row, Upload, message, notification } from "antd";
import 'styles/reset.scss';
import { isMobile } from 'react-device-detect';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { callCreateCompany, callUpdateCompany, callUploadSingleFile } from "@/config/api";
import { ICompany } from "@/types/backend";
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ICompany | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface ICompanyForm {
    name: string;
    address: string;
    linkUrl: string;
    minScale: number;
    maxScale: number;

}

interface ICompanyLogo {
    name: string;
    uid: string;
}

const ModalCompany = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    //modal animation
    const [animation, setAnimation] = useState<string>('open');

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [loadingUploadImage, setLoadingUploadImage] = useState<boolean>(false);
    const [dataLogo, setDataLogo] = useState<ICompanyLogo[]>([]);
    const [dataImage, setDataImage] = useState<ICompanyLogo[]>([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [value, setValue] = useState<string>("");
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?._id && dataInit?.description) {
            setValue(dataInit.description);
        }
    }, [dataInit])

    const submitCompany = async (valuesForm: ICompanyForm) => {
        const { name, address, linkUrl, minScale, maxScale } = valuesForm;

        if (dataLogo.length === 0 && !dataInit?.logo) {
            message.error('Please upload Logo image')
            return;
        }
        if (dataImage.length === 0 && !dataInit?.image) {
            message.error('Please upload Company photo')
            return;
        }

        if (dataInit?._id) {
            //update
            const res = await callUpdateCompany(dataInit._id, name, address, value,  dataLogo.length > 0 ? dataLogo[0].name : dataInit.logo, dataImage.length > 0 ? dataImage[0].name : dataInit.image, linkUrl, minScale, maxScale);
            if (res.data) {
                message.success("Company update successful");
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
            const res = await callCreateCompany(name, address, value, dataLogo[0].name, dataImage[0].name, linkUrl, minScale, maxScale);
            if (res.data) {
                message.success("New company added successfully");
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
        setValue("");
        setDataInit(null);

        //add animation when closing modal
        setAnimation('close')
        await new Promise(r => setTimeout(r, 400))
        setOpenModal(false);
        setAnimation('open')
    }

    const handleRemoveFile = (file: any) => {
        setDataLogo([])
    }
    const handleRemoveFileImage = (file: any) => {
        setDataImage([])
    }


    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? "An error occurred while uploading the file.")
        }
    };

    const handleChangeImage = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUploadImage(true);
        }
        if (info.file.status === 'done') {
            setLoadingUploadImage(false);
        }
        if (info.file.status === 'error') {
            setLoadingUploadImage(false);
            message.error(info?.file?.error?.event?.message ?? "An error occurred while uploading the file.")
        }
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, "company");
        if (res && res.data) {
            setDataLogo([{
                name: res.data.fileName,
                uid: uuidv4()
            }])
            if (onSuccess) onSuccess('ok')
        } else {
            if (onError) {
                setDataLogo([])
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };

    const handleUploadFileImage = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, "company_image");
        if (res && res.data) {
            setDataImage([{
                name: res.data.fileName,
                uid: uuidv4()
            }])
            if (onSuccess) onSuccess('ok')
        } else {
            if (onError) {
                setDataImage([])
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };

    return (
        <>
            {openModal &&
                <>
                    <ModalForm
                        title={<>{dataInit?._id ? "Company Update" : "Create new Company"}</>}
                        open={openModal}
                        modalProps={{
                            onCancel: () => { handleReset() },
                            afterClose: () => handleReset(),
                            destroyOnClose: true,
                            width: isMobile ? "100%" : 900,
                            footer: null,
                            keyboard: false,
                            maskClosable: false,
                            className: `modal-company ${animation}`,
                            rootClassName: `modal-company-root ${animation}`
                        }}
                        scrollToFirstError={true}
                        preserve={false}
                        form={form}
                        onFinish={submitCompany}
                        initialValues={dataInit?._id ? dataInit : {}}
                        submitter={{
                            render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                            submitButtonProps: {
                                icon: <CheckSquareOutlined />
                            },
                            searchConfig: {
                                resetText: "Cancel",
                                submitText: <>{dataInit?._id ? "Update" : "Create new"}</>,
                            }
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <ProFormText
                                    label="Company name"
                                    name="name"
                                    rules={[{ required: true, message: 'Please do not leave blank' }]}
                                    placeholder="Enter company name"
                                />
                            </Col>
                            <Col span={24}>
                                <ProFormText
                                    label="Link URL"
                                    name="linkUrl"
                                    rules={[{ required: true, type: 'url', message: 'Please enter a valid URL' }]}
                                    placeholder="Enter a link to your company page"
                                />
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Company size"
                                    required
                                >
                                    <Form.Item
                                        name="minScale"
                                        rules={[{ required: true, message: 'Please do not leave blank' }]}
                                        style={{ display: "inline-block", width: "35%" }}
                                    >
                                        <InputNumber
                                            min={0}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <span style={{ display: "inline-block", width: "5%", textAlign: "center" }}> to </span>
                                    <Form.Item
                                        name="maxScale"
                                        rules={[{ required: true, message: 'Please do not leave blank' }]}
                                        style={{ display: "inline-block", width: "35%" }}
                                    >
                                        <InputNumber
                                            min={0}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <span> staff</span>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Logo Image"
                                    name="logo"
                                    rules={[{
                                        required: true,
                                        message: 'Please do not leave blank',
                                        validator: () => {
                                            if (dataLogo.length > 0 || (dataInit && dataInit.logo)) return Promise.resolve();
                                            else return Promise.reject(false);
                                        }
                                    }]}
                                >
                                    <ConfigProvider locale={enUS}>
                                        <Upload
                                            name="logo"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            maxCount={1}
                                            multiple={false}
                                            customRequest={handleUploadFileLogo}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                            onRemove={(file) => handleRemoveFile(file)}
                                            onPreview={handlePreview}
                                            defaultFileList={
                                                dataInit?._id ?
                                                    [
                                                        {
                                                            uid: uuidv4(),
                                                            name: dataInit?.logo ?? "",
                                                            status: 'done',
                                                            url: `${import.meta.env.VITE_BACKEND_URL}/images/company/${dataInit?.logo}`,
                                                        }
                                                    ] : []
                                            }

                                        >
                                            <div>
                                                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    </ConfigProvider>
                                </Form.Item>

                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Company photo"
                                    name="image"
                                    rules={[{
                                        required: true,
                                        message: 'Please do not leave blank',
                                        validator: () => {
                                            if (dataImage.length > 0 || (dataInit && dataInit.image)) return Promise.resolve();
                                            else return Promise.reject(false);
                                        }
                                    }]}
                                >
                                    <ConfigProvider locale={enUS}>
                                        <Upload
                                            name="image"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            maxCount={1}
                                            multiple={false}
                                            customRequest={handleUploadFileImage}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChangeImage}
                                            onRemove={(file) => handleRemoveFileImage(file)}
                                            onPreview={handlePreview}
                                            defaultFileList={
                                                dataInit?._id ?
                                                    [
                                                        {
                                                            uid: uuidv4(),
                                                            name: dataInit?.image ?? "",
                                                            status: 'done',
                                                            url: `${import.meta.env.VITE_BACKEND_URL}/images/company_image/${dataInit?.image}`,
                                                        }
                                                    ] : []
                                            }

                                        >
                                            <div>
                                                {loadingUploadImage ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    </ConfigProvider>
                                </Form.Item>

                            </Col>

                            <Col span={16}>
                                <ProFormTextArea
                                    label="Address"
                                    name="address"
                                    rules={[{ required: true, message: 'Please do not leave blank' }]}
                                    placeholder="Enter company address"
                                    fieldProps={{
                                        autoSize: { minRows: 4 }
                                    }}
                                />
                            </Col>

                            <ProCard
                                title="Describe"
                                // subTitle="mô tả công ty"
                                headStyle={{ color: '#d81921' }}
                                style={{ marginBottom: 20 }}
                                headerBordered
                                size="small"
                                bordered
                            >
                                <Col span={24}>
                                    <ReactQuill
                                        theme="snow"
                                        value={value}
                                        onChange={setValue}
                                    />
                                </Col>
                            </ProCard>



                        </Row>
                    </ModalForm>
                    <Modal
                        open={previewOpen}
                        title={previewTitle}
                        footer={null}
                        onCancel={() => setPreviewOpen(false)}
                        style={{ zIndex: 1500 }}
                    >
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </>
            }
        </>
    )
}

export default ModalCompany;

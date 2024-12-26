import { IUser } from "@/types/backend";
import { Badge, Descriptions, Drawer } from "antd";
import dayjs from 'dayjs';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IUser | null;
    setDataInit: (v: any) => void;
}
const ViewDetailUser = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;

    return (
        <>
            <Drawer
                title="User Information"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"40vw"}
                maskClosable={false}
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label="Name">{dataInit?.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataInit?.email}</Descriptions.Item>

                    <Descriptions.Item label="Gender">{dataInit?.gender}</Descriptions.Item>
                    <Descriptions.Item label="Age">{dataInit?.age}</Descriptions.Item>

                    <Descriptions.Item label="Role" >
                        <Badge status="processing" text={<>{dataInit?.role}</>} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Address" >{dataInit?.address}</Descriptions.Item>
                    <Descriptions.Item label="Company information" span={2}>
                        Id: {dataInit?.company?._id ?? "-"}
                        <br />
                        Name: {dataInit?.company?.name ?? "-"}
                        <br />
                    </Descriptions.Item>
                    <Descriptions.Item label="Date created">{dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="Date updated">{dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>

                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailUser;
import {
  FooterToolbar,
  ModalForm,
  ProCard,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import {
  callCreateRole,
  callFetchPermission,
  callUpdateRole,
} from "@/config/api";
import { IPermission } from "@/types/backend";
import { CheckSquareOutlined } from "@ant-design/icons";
import ModuleApi from "./module.api";
import { useState, useEffect } from "react";
import _ from "lodash";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetSingleRole } from "@/redux/slice/roleSlide";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  reloadTable: () => void;
}

const ModalRole = (props: IProps) => {
  const { openModal, setOpenModal, reloadTable } = props;
  const singleRole = useAppSelector((state) => state.role.singleRole);
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const [listPermissions, setListPermissions] = useState<
    | {
        module: string;
        permissions: IPermission[];
      }[]
    | null
  >(null);

  const groupByPermission = (data: any) => {
    return _(data)
      .groupBy((x) => x.module)
      .map((value, key) => {
        return { module: key, permissions: value as IPermission[] };
      })
      .value();
  };

  useEffect(() => {
    const init = async () => {
      const res = await callFetchPermission(`current=1&pageSize=100`);
      if (res.data?.result) {
        setListPermissions(groupByPermission(res.data?.result));
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (listPermissions?.length && singleRole?._id) {
      form.setFieldsValue({
        name: singleRole.name,
        isActive: singleRole.isActive,
        description: singleRole.description,
      });
      const userPermissions = groupByPermission(singleRole.permissions);

      listPermissions.forEach((x) => {
        let allCheck = true;
        x.permissions?.forEach((y) => {
          const temp = userPermissions.find((z) => z.module === x.module);

          if (temp) {
            const isExist = temp.permissions.find((k) => k._id === y._id);
            if (isExist) {
              form.setFieldValue(["permissions", y._id as string], true);
            } else allCheck = false;
          } else {
            allCheck = false;
          }
        });
        form.setFieldValue(["permissions", x.module], allCheck);
      });
    }
  }, [listPermissions, singleRole]);

  const submitRole = async (valuesForm: any) => {
    const { description, isActive, name, permissions } = valuesForm;
    const checkedPermissions = [];

    if (permissions) {
      for (const key in permissions) {
        if (key.match(/^[0-9a-fA-F]{24}$/) && permissions[key] === true) {
          checkedPermissions.push(key);
        }
      }
    }

    if (singleRole?._id) {
      //update
      const role = {
        name,
        description,
        isActive,
        permissions: checkedPermissions,
      };
      const res = await callUpdateRole(role, singleRole._id);
      if (res.data) {
        message.success("Role update successful");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "An error occurred.",
          description: res.message,
        });
      }
    } else {
      //create
      const role = {
        name,
        description,
        isActive,
        permissions: checkedPermissions,
      };
      const res = await callCreateRole(role);
      if (res.data) {
        message.success("New role added successfully");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "An error occurred.",
          description: res.message,
        });
      }
    }
  };

  const handleReset = async () => {
    form.resetFields();
    setOpenModal(false);
    dispatch(resetSingleRole({}));
  };

  return (
    <>
      <ModalForm
        title={<>{singleRole?._id ? "Update Role" : "Create New Role"}</>}
        open={openModal}
        modalProps={{
          onCancel: () => {
            handleReset();
          },
          afterClose: () => handleReset(),
          destroyOnClose: true,
          width: isMobile ? "100%" : 900,
          keyboard: false,
          maskClosable: false,
        }}
        scrollToFirstError={true}
        preserve={false}
        form={form}
        onFinish={submitRole}
        submitter={{
          render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
          submitButtonProps: {
            icon: <CheckSquareOutlined />,
          },
          searchConfig: {
            resetText: "Cancel",
            submitText: <>{singleRole?._id ? "Update" : "Create new"}</>,
          },
        }}
      >
        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <ProFormText
              label="Role Name"
              name="name"
              rules={[{ required: true, message: "Please do not leave blank" }]}
              placeholder="Enter name"
            />
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
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
            <ProFormTextArea
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please do not leave blank" }]}
              placeholder="Enter role description"
              fieldProps={{
                autoSize: { minRows: 2 },
              }}
            />
          </Col>
          <Col span={24}>
            <ProCard
              title="Permission"
              subTitle="Permissions allowed for this role"
              headStyle={{ color: "#d81921" }}
              style={{ marginBottom: 20 }}
              headerBordered
              size="small"
              bordered
            >
              <ModuleApi form={form} listPermissions={listPermissions} />
            </ProCard>
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default ModalRole;

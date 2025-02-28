import { callGetSubscriberSkills, callUpdateSubscriber } from "@/config/api";
import { SKILLS_LIST } from "@/config/utils";
import { useAppSelector } from "@/redux/hooks";
import { MonitorOutlined } from "@ant-design/icons";
import { Button, Col, Form, message, notification, Row, Select } from "antd";
import { useEffect } from "react";

const JobByEmail = (props: any) => {
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state.account.user);

  useEffect(() => {
    const init = async () => {
      const res = await callGetSubscriberSkills();
      if (res && res.data) {
        form.setFieldValue("skills", res.data.skills);
      }
    };
    init();
  }, []);
 
  const onFinish = async (values: any) => {
    const { skills } = values;
    const res = await callUpdateSubscriber({
      email: user.email,
      name: user.name,
      skills: skills ? skills : [],
    });
    if (res.data) {
      message.success("Information updated successfully");
    } else {
      notification.error({
        message: "An error occurred.",
        description: res.message,
      });
    }
  };

  return (
    <>
      <Form onFinish={onFinish} form={form} className="p-8">
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Form.Item
              label={"Skill"}
              name={"skills"}
              rules={[
                { required: true, message: "Please select at least 1 skill!" },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                showArrow={false}
                style={{ width: "100%" }}
                placeholder={
                  <>
                    <MonitorOutlined /> Search by skill...
                  </>
                }
                optionLabelProp="label"
                options={SKILLS_LIST}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Button onClick={() => form.submit()}>Update</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default JobByEmail;

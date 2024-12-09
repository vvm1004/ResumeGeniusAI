import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useSelector } from "react-redux";
import "./index.scss";

const AccountManagement = () => {
  const user = useSelector((state) => state.account);

  console.log("userrrr", user);

  const renderInformation = () => {
    return (
      <>
        <div>
          <h2>Information</h2>
        </div>
      </>
    );
  };

  const renderChangeInformation = () => {
    return (
      <>
        <div>
          <h2>Change Information</h2>
        </div>
      </>
    );
  };

  const renderChangePassword = () => {
    return (
      <>
        <div>
          <h2>Change Password</h2>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="p-8">
        <h2 className="text-blue-600 text-3xl font-bold">Account Management</h2>
        <div className="w-full h-[70vh] mt-4 p-4 pt-0 border-2 border-blue-600 rounded-md">
          <Tabs className="custom-tabs" defaultActiveKey="1">
            <TabPane tab="Information" key="1">
              {renderInformation()}
            </TabPane>
            <TabPane tab="Change Information" key="2">
              {renderChangeInformation()}
            </TabPane>
            <TabPane tab="Change Password" key="3">
              {renderChangePassword()}
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AccountManagement;

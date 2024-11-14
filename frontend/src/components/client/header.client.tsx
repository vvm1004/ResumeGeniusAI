import { useState, useEffect } from "react";
import {
  CodeOutlined,
  ContactsOutlined,
  DashOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  RiseOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Avatar, Drawer, Dropdown, MenuProps, Space, message } from "antd";
import { Menu, ConfigProvider } from "antd";
import styles from "@/styles/client.module.scss";
import { isMobile } from "react-device-detect";
import { FaReact } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { callLogout } from "@/config/api";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import ManageAccount from "./modal/manage.account";

const items: MenuProps["items"] = [
  {
    label: <Link to={"/"}>Home Page</Link>,
    key: "/",
    icon: <TwitterOutlined />,
  },
  {
    label: <Link to={"/jobsAll"}>Find Jobs</Link>,
    key: "/jobSearch",
    icon: <CodeOutlined />,
  },
  {
    label: <Link to={"/job"}>Job Application</Link>,
    key: "/job",
    icon: <CodeOutlined />,
  },
  {
    label: <Link to={"/company"}>Top IT Companies</Link>,
    key: "/company",
    icon: <RiseOutlined />,
  },
  {
    label: <Link to={"/resumes"}>My Resumes</Link>,
    key: "/resumes",
    icon: <ContactsOutlined />,
    // children: [
    //   {
    //     label: <Link to={"/resumes/create"}>Create Resume</Link>,
    //     key: "/resumes/create",
    //   },
    //   {
    //     label: <Link to={"/resumes/upgrade"}>Upgrade Resume</Link>,
    //     key: "/resumes/upgrade",
    //   },
    //   {
    //     label: <Link to={"/resumes"}>My Resumes</Link>,
    //     key: "/resumes",
    //   },
    //   {
    //     label: <Link to={"/resumes/templates"}>Resume Template</Link>,
    //     key: "/resumes/templates",
    //   },
    // ],
  },
];

const Header = (props: any) => {
  const [current, setCurrent] = useState("home");
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state.account.user);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(setLogoutAction({}));
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  const itemsDropdown: MenuProps['items'] = [
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => setOpenManageAccount(true)}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "manage-account",
      icon: <ContactsOutlined />,
    },
    {
      label: <Link to={"/admin"}>Trang Quản Trị</Link>,
      key: "admin",
      icon: <DashOutlined />,
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  const itemsMobiles = [...items, ...itemsDropdown];

  return (
    <>
      <div className={styles["header-section"]}>
          {!isMobile ? (
            <div className="flex">
              <div className={styles["top-menu"]}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#fff",
                      colorBgContainer: "#222831",
                      colorText: "#a7a7a7",
                    },
                  }}
                >
                  <Menu
                    onClick={onClick}
                    className="flex-1 ml-32"
                    selectedKeys={[current]}
                    mode="horizontal"
                    items={items}
                  />
                </ConfigProvider>

                <div className={`${styles["extra"]} mr-8`}>
                  {isAuthenticated === false ? (
                    <Link to={"/login"}>Đăng Nhập</Link>
                  ) : (
                    <Dropdown
                      menu={{ items: itemsDropdown }}
                    //   trigger={["click"]}
                    >
                      <Space style={{ cursor: "pointer" }}>
                        <span>Welcome {user?.name}</span>
                        <Avatar>
                          {user?.name?.substring(0, 2)?.toUpperCase()}{" "}
                        </Avatar>
                      </Space>
                    </Dropdown>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles["header-mobile"]}>
              <span>Your APP</span>
              <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
            </div>
          )}
        </div>
      <Drawer
        title="Chức năng"
        placement="right"
        onClose={() => setOpenMobileMenu(false)}
        open={openMobileMenu}
      >
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="vertical"
          items={itemsMobiles}
        />
      </Drawer>
      <ManageAccount open={openMangeAccount} onClose={setOpenManageAccount} />
    </>
  );
};

export default Header;

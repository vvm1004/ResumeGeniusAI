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
import { MenuProps, message } from "antd";
import styles from "@/styles/client.module.scss";
import { isMobile } from "react-device-detect";
import { FaReact } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { callLogout } from "@/config/api";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import ManageAccount from "./modal/manage.account";
import {
  ConfigProvider,
  Menu,
  Dropdown,
  Space,
  Avatar,
  Drawer,
  Badge,
  Modal,
} from "antd";
import { BellOutlined } from "@ant-design/icons";
import "./header.css";
import { useSocket } from "../../hook/useSocket"; // Đảm bảo bạn đã tạo đúng đường dẫn
import { useSelector } from "react-redux";
import {
  getUnreadNotifications,
  markNotificationAsRead,
} from "./handleContent";
import Logo from "../../assets/LogoIcon-removebg-preview.png";
import { HomeIcon } from "lucide-react";
import axios from "axios";
import { IUser } from "@/types/backend";
import { MdContactPage, MdSailing, MdTableBar } from "react-icons/md";

const items: MenuProps["items"] = [
  {
    label: <Link to={"/"}>Home Page</Link>,
    key: "/",
    icon: <HomeIcon size={16} />,
  },
  {
    label: <Link to={"/jobsAll"}>Find Jobs</Link>,
    key: "/jobsAll",
    icon: <CodeOutlined size={16} />,
  },
  // {
  //   label: <Link to={"/job"}>Job Application</Link>,
  //   key: "/job",
  //   icon: <CodeOutlined />,
  // },
  {
    label: <Link to={"/company"}>Top IT Companies</Link>,
    key: "/company",
    icon: <RiseOutlined size={16} />,
  },
  {
    label: <Link to={"/resumes"}>My Resumes</Link>,
    key: "/resumes",
    icon: <ContactsOutlined size={16} />,
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
  {
    label: <Link to={"/suggest-tips"}>Tips</Link>,
    key: "/suggest-tips",
    icon: <MdSailing size={16} />,
  },
];
interface Notification {
  _id: string;

  message: string;
  contentId: string; // ID của content liên quan (có thể là job, application, ... tùy theo yêu cầu)
  receiverId: string; // ID người nhận
  senderId: string; // ID người gửi
  link: string;
  timestamp: Date;
  isRead?: boolean;
}
const Header = (props: any) => {
  const [current, setCurrent] = useState("home");
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state.account.user);

  const [userId, setUserId] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsData, setNotificationsData] = useState([]);
  const [data, setData] = useState<IUser>();

  useEffect(() => {
    const loadNotifications = async () => {
      const unreadNotifications = await getUnreadNotifications(userId);

      setNotifications(unreadNotifications);
    };

    if (userId != "") loadNotifications();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/${userId}`
      );
      setData(response.data.data);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);
      fetchData();
    }
  }, [user, user._id]);

  const { socket, socketNotificationsData } = useSocket(userId); // Kết nối WebSocket

  // Load notifications chưa đọc khi socket hoặc notificationsData thay đổi
  useEffect(() => {
    if (socket) {
      console.log("socket:", socket, "notifications:", notificationsData);

      const loadNotifications = async () => {
        const unreadNotifications = await getUnreadNotifications(userId);

        setNotifications(unreadNotifications);
      };

      loadNotifications();
    }
  }, [socket, socketNotificationsData]);

  const toggleNotificationRead = async (id: string) => {
    try {
      // Cập nhật trạng thái local state

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== id)
      );
      // Gọi API để đánh dấu notification là đã đọc trong DB
      await markNotificationAsRead(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const handleNotificationNavigate = (link: string, id: string) => {
    // Điều hướng đến trang chi tiết thông báo
    navigate(`/${link}`);
    toggleNotificationRead(id)
  };
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

  const itemsDropdown: MenuProps["items"] = [
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          // onClick={() => setOpenManageAccount(true)}
          onClick={() => {
            navigate("/account-management");
          }}
        >
          Account Management
        </label>
      ),
      key: "manage-account",
      icon: <ContactsOutlined />,
    },
    {
      label: <Link to={"/admin"}>Administration Page</Link>,
      key: "admin",
      icon: <DashOutlined />,
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Log out
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
                <div className="logoContent">
                  <img className="logo" src={Logo} alt="Logo" />
                  {user.role.name != "HR" && user.role.name != "ADMIN" && (
                    <Link className="hr_register" to="/hr_register">
                      Register Become Human Resource ?
                    </Link>
                  )}
                </div>

                <Menu
                  onClick={onClick}
                  className="flex-1" // Loại bỏ margin-left trong className
                  style={{ marginLeft: "5%" }} // Sử dụng style trực tiếp để canh lệch trái
                  selectedKeys={[current]}
                  mode="horizontal"
                  items={items}
                />
              </ConfigProvider>

              <Dropdown
                overlay={
                  <div
                    className="notification-dropdown"
                    style={{ padding: "10px" }}
                  >
                    {notifications.length > 0 ? (
                      <ul>
                        {notifications.map((notification) => (
                          <li
                            key={notification._id}
                            className={"notification-item"}
                            style={{
                              padding: "5px 0",
                              cursor: "pointer",
                              position: "relative", // Ensures that the "Read" link is positioned relative to the li
                              minHeight: "20px", // Optional: To ensure each notification has enough height
                            }}
                            onClick={() =>
                              handleNotificationNavigate(notification.link, notification._id)

                            }
                          >
                            <br />
                            <span
                              onClick={() =>
                                toggleNotificationRead(notification._id)
                              }
                              style={{
                                color: "blue",
                                textDecoration: "underline",
                                position: "absolute", // Absolute positioning within the parent li
                                top: "5px", // Distance from the top of the li
                                right: "10px", // Distance from the right side of the li
                                fontSize: "12px", // Smaller font size
                                cursor: "pointer",
                              }}
                            >
                              Read
                            </span>
                            {/* Notification message */}
                            {notification.message}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No new notifications</p>
                    )}
                  </div>
                }
              >
                <Badge count={notifications.length} dot>
                  <BellOutlined
                    style={{
                      fontSize: 24,
                      color: "#fff",
                      cursor: "pointer",
                      paddingRight: "0px",
                    }}
                  />
                </Badge>
              </Dropdown>

              <div style={{ paddingLeft: "20px" }}></div>

              <div className={`${styles["extra"]} mr-8`}>
                {isAuthenticated === false ? (
                  <Link to={"/login"}>Login</Link>
                ) : (
                  <Dropdown
                    menu={{ items: itemsDropdown }}
                  //   trigger={["click"]}
                  >
                    <Space style={{ cursor: "pointer" }}>
                      <span>Welcome {user?.name}</span>
                      {/* <Avatar>
                        {user?.name?.substring(0, 2)?.toUpperCase()}{" "}
                      </Avatar> */}
                      <Avatar
                        src={
                          data?.avatar
                            ? data?.avatar
                            : `${import.meta.env.VITE_BACKEND_URL
                            }/images/avatar_user/avatar-default.jpg`
                        }
                        alt="Avatar"
                      ></Avatar>
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

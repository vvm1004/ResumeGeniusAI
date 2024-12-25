import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdOutlineFindInPage,
  MdSave,
  MdSupervisorAccount,
} from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import "./index.scss";
import { MSquareIcon } from "lucide-react";

const DashboardResumes = () => {
  const user = useSelector((state) => state.account.user);

  const [activeMenuItem, setActiveMenuItem] = useState("resumes");

  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    const menuItem = currentPath.substring(currentPath.lastIndexOf("/") + 1);
    if (menuItem) {
      setActiveMenuItem(menuItem);
    }
  }, [location.pathname]);

  const handleMenuClick = (menuItem, path) => {
    setActiveMenuItem(menuItem);
    navigate(path);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <div className="w-1/6 p-6 sticky top-14 h-[calc(100vh-3.5rem)] ">
          {/* <div className="flex justify-between items-center">
            <img
              className="w-12 h-12 object-contain border-2 rounded-full font-12"
              // src="https://tse2.mm.bing.net/th?id=OIP.xv5ky4lYh1TkiIZW6wwYJAAAAA&pid=Api&P=0&h=180"
              src={
                user?.image ||
                "https://tse2.mm.bing.net/th?id=OIP.xv5ky4lYh1TkiIZW6wwYJAAAAA&pid=Api&P=0&h=180"
              }
              alt="Ảnh đại diện"
            />
            <div className="text-center">
              <h2 className="font-bold">{user?.name}</h2>
              <h3 className="text-gray-500">Set your target role</h3>
            </div>
          </div> */}
          <div className="">
            <ul className="text-sm text-gray-600 font-medium">
              {/* <li
                className={`flex items-center p-2 text-left w-full hover:rounded-md cursor-pointer hover:bg-blue-100 hover:text-blue-600 ${
                  activeMenuItem === "dashboard"
                    ? "rounded-md bg-blue-100 text-blue-600"
                    : ""
                }`}
                onClick={() => handleMenuClick("dashboard", "/dashboard")}
              >
                <MdDashboard className="mr-4 text-xl" /> Dashboard
              </li> */}
              <li
                className={`flex text-sm items-center p-2 text-left w-full hover:rounded-md cursor-pointer hover:bg-blue-100 hover:text-blue-600 ${activeMenuItem === "account-management"
                  ? "rounded-md bg-blue-100 text-blue-600"
                  : ""
                  }`}
                onClick={() =>
                  handleMenuClick("account-management", "/account-management")
                }
              >
                <MdSupervisorAccount className="mr-4 text-xl" />
                Account Management
              </li>
              <li
                className={`flex items-center p-2 text-left w-full hover:rounded-md cursor-pointer hover:bg-blue-100 hover:text-blue-600 ${activeMenuItem === "resumes"
                  ? "rounded-md bg-blue-100 text-blue-600"
                  : ""
                  }`}
                onClick={() => handleMenuClick("resumes", "/resumes")}
              >
                <IoDocumentTextOutline className="mr-4 text-xl" />
                My Resumes
              </li>
              <li
                className={`flex items-center p-2 text-left w-full hover:rounded-md cursor-pointer hover:bg-blue-100 hover:text-blue-600 ${activeMenuItem === "spread-cv"
                  ? "rounded-md bg-blue-100 text-blue-600"
                  : ""
                  }`}
                onClick={() => handleMenuClick("spread-cv", "/spread-cv")}
              >
                <MdDashboard className="mr-4 text-xl" /> Application Submitted
              </li>
              <li
                className={`flex items-center p-2 text-left w-full hover:rounded-md cursor-pointer hover:bg-blue-100  hover:text-blue-600 ${activeMenuItem === "recommendedJob"
                  ? "rounded-md bg-blue-100 text-blue-600"
                  : ""
                  }`}
                onClick={() =>
                  handleMenuClick("job-by-email", "/job-by-email")
                }
              >
                <MdOutlineFindInPage className="mr-4 text-xl" /> Receive job via email
              </li>
              <li
                className={`flex items-center p-2 text-left w-full hover:rounded-md cursor-pointer hover:bg-blue-100  hover:text-blue-600 ${activeMenuItem === "recommendedJob"
                  ? "rounded-md bg-blue-100 text-blue-600"
                  : ""
                  }`}
                onClick={() =>
                  handleMenuClick("saved-job", "/save-job")
                }
              >
                <MdSave className="mr-4 text-xl" /> Saved Job
              </li>
              {/* <li
                className={`flex items-center p-2 text-left w-full hover:rounded-md cursor-pointer hover:bg-blue-100  hover:text-blue-600 ${activeMenuItem === "dashboard"
                    ? "rounded-md bg-blue-100 text-blue-600"
                    : ""
                  }`}
                onClick={() => handleMenuClick("dashboard", "/dashboard")}
              >
                <IoIosMore className="mr-4 text-xl" /> Other
              </li> */}
            </ul>
          </div>
        </div>

        <div className="flex-1 bg-gray-100 overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DashboardResumes;
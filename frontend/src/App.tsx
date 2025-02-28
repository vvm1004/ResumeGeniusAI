import { useEffect, useRef, useState } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import NotFound from "components/share/not.found";
import Loading from "components/share/loading";
import LoginPage from "pages/auth/login";
import RegisterPage from "pages/auth/register";
import LayoutAdmin from "components/admin/layout.admin";
import ProtectedRoute from "components/share/protected-route.ts";
import Header from "components/client/header.client";
import Footer from "components/client/footer.client";
import JobHomePage from "pages/job_home";
import HomePage from "pages/home";
import styles from "styles/app.module.scss";
import DashboardPage from "./pages/admin/dashboard";
import CompanyPage from "./pages/admin/company";
import PermissionPage from "./pages/admin/permission";
import ResumePage from "./pages/admin/resume";
import RolePage from "./pages/admin/role";
import UserPage from "./pages/admin/user";
import Admin_hr_register_Page from "./pages/admin/hr_register";
import { fetchAccount } from "./redux/slice/accountSlide";
import LayoutApp from "./components/share/layout.app";
import JobPage from "./pages/admin/job";
import ViewUpsertJob from "./components/admin/job/upsert.job";
import ClientJobPage from "./pages/job";
import ClientJobDetailPage from "./pages/job/detail";
import ClientCompanyPage from "./pages/company";
import ClientCompanyDetailPage from "./pages/company/detail";
import DashboardResumes from "./pages/Resume";
import EditResume from "./pages/Resume/EditResume";
import JobSearch from "./pages/job/jobSearch";
import SelectTemplate from "./pages/Resume/SelectTemplate";
import ViewResume from "./pages/Resume/view";
import MyResumes from "./pages/Resume/resumes";
import AccountManagement from "./pages/Resume/account-management";
import SpreadCV from "./pages/Resume/spread-cv";
import HrRegister from "./pages/hr_register";
import ThankYouPage from "./pages/hr_register/ThankYouPage";
import SuggestTips from "./pages/suggestTips/suggestTips";
import JobByEmail from "./pages/Resume/JobByEmail";
import SavedJobs from "./pages/job/savedJobs";
import Saved_Jobs from "./pages/Resume/saved_job";
const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const isEditResumePage = location.pathname.startsWith("/resumes/edit");
  const isViewResumePage = location.pathname.startsWith("/resumes/view");

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="layout-app" ref={rootRef}>
      {!isEditResumePage && !isViewResumePage && (
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}
      <div className={styles["content-app"]}>
        <Outlet context={[searchTerm, setSearchTerm]} />
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.account.isLoading);

  useEffect(() => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    )
      return;
    dispatch(fetchAccount());
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <LayoutApp>
          <LayoutClient />
        </LayoutApp>
      ),
      //errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "jobsAll", element: <ClientJobPage /> },
        { path: "jobs", element: <JobSearch /> },
        { path: "jobs/:id", element: <ClientJobDetailPage /> },
        { path: "saved-jobs", element: <SavedJobs /> },
        { path: "company", element: <ClientCompanyPage /> },
        { path: "company/:id", element: <ClientCompanyDetailPage /> },
        {
          path: "",
          element: <DashboardResumes />,
          children: [
            { path: "resumes", element: <MyResumes /> },
            { path: "account-management", element: <AccountManagement /> },
            { path: "spread-cv", element: <SpreadCV /> },
            { path: "job-by-email", element: <JobByEmail /> },
            { path: "save-job", element: <Saved_Jobs /> },
          ],
        },

        { path: "resumes/edit/:id", element: <EditResume /> },
        { path: "resumes/view/:id", element: <ViewResume /> },
        { path: "resumes/template", element: <SelectTemplate /> },
        { path: "hr_register", element: <HrRegister /> },
        { path: "thank-you-register", element: <ThankYouPage /> },
        { path: "suggest-tips", element: <SuggestTips /> },


        // { path: "account-management", element: <AccountManagement /> },
      ],
    },

    {
      path: "/admin",
      element: (
        <LayoutApp>
          <LayoutAdmin />{" "}
        </LayoutApp>
      ),
      // errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "company",
          element: (
            <ProtectedRoute>
              <CompanyPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "user",
          element: (
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "manage_resgister_hr",
          element: (
            <ProtectedRoute>
              <Admin_hr_register_Page />
            </ProtectedRoute>
          ),
        },

        {
          path: "job",
          children: [
            {
              index: true,
              element: (
                <ProtectedRoute>
                  {" "}
                  <JobPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "upsert",
              element: (
                <ProtectedRoute>
                  <ViewUpsertJob />
                </ProtectedRoute>
              ),
            },
          ],
        },

        {
          path: "resume",
          element: (
            <ProtectedRoute>
              <ResumePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "permission",
          element: (
            <ProtectedRoute>
              <PermissionPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "role",
          element: (
            <ProtectedRoute>
              <RolePage />
            </ProtectedRoute>
          ),
        },
      ],
    },

    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

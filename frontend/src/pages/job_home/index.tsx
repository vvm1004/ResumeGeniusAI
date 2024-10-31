import { Divider } from "antd";
import styles from "styles/client.module.scss";
import SearchClient from "@/components/client/search.client";
import JobCard from "@/components/client/card/job.card";
import CompanyCard from "@/components/client/card/company.card";

const JobHomePage = () => {
  return (
    <>
      <div className="search-content">
        <SearchClient />
      </div>
      <div className={`${styles["home-section"]} bg-gray-100`}>
        {/* <Divider />
      <CompanyCard />
      <div style={{ margin: 50 }}></div>
      <Divider /> */}
        <JobCard />
      </div>
    </>
  );
};

export default JobHomePage;

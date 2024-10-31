import SearchClient from "@/components/client/search.client";
import { Col, Divider, Row } from "antd";
import styles from "styles/client.module.scss";
import JobCard from "@/components/client/card/job.card";

const ClientJobPage = (props: any) => {
  return (
    <>
      <div className="search-content">
        <SearchClient />
      </div>
      <div className="bg-gray-100">
        <JobCard />
      </div>
    </>
  );
};

export default ClientJobPage;

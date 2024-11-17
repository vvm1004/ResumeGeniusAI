import SearchClient from "@/components/client/search.client";
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

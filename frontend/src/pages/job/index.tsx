import SearchClient from "@/components/client/search.client";
import JobCard from "@/components/client/card/job.card";
import CompanyList from "@/components/client/CompanyList.client";

const ClientJobPage = (props: any) => {
  return (
    <>
      <div className="search-content">
        <SearchClient />
      </div>
      <div className="bg-gray-100">
        <JobCard />
      </div>
      {/* <div className="bg-gray-100">
        <JobCard />
      </div> */}
      <div className="w-full bg-gray-100">
        <CompanyList />
      </div>
      <div className="mt-16 mb-16 text-center text-gray-800">
        <h2 className="text-4xl font-bold text-blue-700 mb-6">
          Explore Career Opportunities at Top Companies
        </h2>

        <div className="mt-8 text-md leading-relaxed text-gray-600 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            Easy Job Search Experience
          </h3>
          <p>
            Searching for a job has never been easier! With a friendly and
            easy-to-use interface, our website provides you with a powerful
            search engine to discover the latest career opportunities from
            reputable and leading companies. You can easily filter jobs by many
            important criteria such as location, salary, experience, and
            industry, helping you quickly find the right job for you.
          </p>
        </div>

        <div className="mt-8 text-md leading-relaxed text-gray-600 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            Outstanding Features
          </h3>
          <p>
            Each job is presented in a card format with all the necessary
            information: job title, hiring company, salary, and location. Simply
            click on each job card to learn more details about the job
            requirements and description. Not only that, we also give you the
            ability to filter and sort jobs by criteria such as highest salary,
            newest jobs, or career opportunities in the industry you are
            interested in.
          </p>
        </div>

        <div className="mt-8 text-md leading-relaxed text-gray-600 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            Optimized Interface For All Platforms
          </h3>
          <p>
            The site is optimized for both desktop and mobile, providing a
            smooth experience across all platforms. Features like smart
            pagination and an easy-to-use filtering system help you quickly find
            the right jobs, saving you time searching. This allows you to focus
            on applying and getting closer to your dream job.
          </p>
        </div>

        <div className="mt-8 text-md leading-relaxed text-gray-600 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            Start Your Search
          </h3>
          <p>
            Start your career search today and discover great jobs you can't
            miss. We're here to help you on your career path!
          </p>
        </div>
      </div>
    </>
  );
};

export default ClientJobPage;

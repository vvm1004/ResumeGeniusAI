// import { Card, Col, Row, Statistic } from "antd";
// import CountUp from 'react-countup';

// const DashboardPage = () => {
//     const formatter = (value: number | string) => {
//         return (
//             <CountUp end={Number(value)} separator="," />
//         );
//     };

//     return (
//         <Row gutter={[20, 20]}>
//             <Col span={24} md={8}>
//                 <Card title="Card title" bordered={false} >
//                     <Statistic
//                         title="Active Users"
//                         value={112893}
//                         formatter={formatter}
//                     />

//                 </Card>
//             </Col>
//             <Col span={24} md={8}>
//                 <Card title="Card title" bordered={false} >
//                     <Statistic
//                         title="Active Users"
//                         value={112893}
//                         formatter={formatter}
//                     />
//                 </Card>
//             </Col>
//             <Col span={24} md={8}>
//                 <Card title="Card title" bordered={false} >
//                     <Statistic
//                         title="Active Users"
//                         value={112893}
//                         formatter={formatter}
//                     />
//                 </Card>
//             </Col>

//         </Row>
//     )
// }

// export default DashboardPage;
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Statistic } from "antd";
import { Line } from '@ant-design/charts';
import CountUp from 'react-countup';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import './dashboard.css';
import { callNumberOfCompany, callNumberOfJobs, callNumberOfResumeOverTime, callNumberOfUser } from '@/config/api';
import { isNull } from 'lodash';
import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';

// Định nghĩa kiểu dữ liệu cho kết quả trả về từ API (số lượng theo ngày)
interface ResumeCountByDate {
    _id: {
        year: number;
        month: number;
        day: number;
    };
    count: number;
}

const DashboardPage = () => {

    // const [totalJobs, setTotalJobs] = useState<number>(0);
    // const [totalUsers, setTotalUsers] = useState<number>(0);
    // const [totalCompanies, setTotalCompanies] = useState<number>(0);
    // const [resumeData, setResumeData] = useState<ResumeCountByDate[]>([]); // Lưu trữ dữ liệu số lượng resume theo ngày
    // const [startDate, setStartDate] = useState('');
    // const [endDate, setEndDate] = useState('');

    // // Fetch data for job count, user count, company count and resume count
    // useEffect(() => {
    //     const fetchCounts = async () => {
    //         try {
    //             const jobResponse = await callNumberOfJobs();
    //             setTotalJobs(jobResponse.data);

    //             const userResponse = await callNumberOfUser();
    //             setTotalUsers(userResponse.data);

    //             const companyResponse = await callNumberOfCompany();
    //             setTotalCompanies(companyResponse.data);

    //             // Fetch resume count data for chart
    //             const resumeData = callNumberOfResumeOverTime();
    //             console.log("resumeData: ", resumeData)
    //             setResumeData((await resumeData).data);
    //         } catch (error) {
    //             console.error("Error fetching counts:", error);
    //         }
    //     };

    //     fetchCounts(); // Fetch counts when component mounts
    // }, []); // Empty dependency array to run once on mount

    // const formatter = (value: number | string) => {
    //     return <CountUp end={Number(value)} separator="," />;
    // };

    // Hàm để tính toán ngày bắt đầu và kết thúc của tháng

    const [totalJobs, setTotalJobs] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalCompanies, setTotalCompanies] = useState<number>(0);
    const [resumeData, setResumeData] = useState<any[]>([]); // Lưu trữ dữ liệu số lượng resume theo ngày
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isMax, setIsMax] = useState(false);

    const [curDate, setCurDate] = useState<Date>(new Date());  // Khởi tạo với đối tượng Date
    const getMonthDates = (monthOffset: number = 0) => {


        curDate.setMonth(curDate.getMonth() + monthOffset); // Cộng trừ tháng dựa trên offset
        console.log("---------------------------\ncurDate.getMonth():", curDate.getMonth())
        console.log("monthOffset:", monthOffset)

        // Lấy ngày đầu và ngày cuối của tháng
        const start = new Date(curDate.getFullYear(), curDate.getMonth(), 1); // Ngày đầu tháng
        const end = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0); // Ngày cuối tháng

        return { startDate: start.toISOString(), endDate: end.toISOString() };
    };

    // Hàm để fetch data từ API khi startDate hoặc endDate thay đổi
    const fetchResumeData = async () => {
        if (startDate == "" || endDate == "" || isNull(endDate)) return;
        try {
            console.log("startDate, endDate\n", startDate, endDate)
            const response = await callNumberOfResumeOverTime(startDate, endDate);
            console.log("response", response)

            setResumeData(response.data);
        } catch (error) {
            console.error('Error fetching resume data:', error);
        }
    };

    // Hàm gọi data cho job count, user count, company count
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const jobResponse = await callNumberOfJobs();
                setTotalJobs(jobResponse.data);

                const userResponse = await callNumberOfUser();
                setTotalUsers(userResponse.data);

                const companyResponse = await callNumberOfCompany();
                setTotalCompanies(companyResponse.data);
                const currentDate = new Date();

                setCurDate(currentDate)
                // Fetch resume count data cho chart
                fetchResumeData(); // Fetch resume data khi mount component
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        fetchCounts();
    }, []);
    // Format giá trị khi hiển thị trên thống kê
    const formatter = (value: number | string) => {
        return <CountUp end={Number(value)} separator="," />;
    };

    // Hàm để thay đổi tháng khi người dùng nhấn vào nút < hoặc >
    const handleMonthChange = (direction: number) => {
        const date = new Date();
        if (date.getMonth() < 12 && date.getMonth() <= curDate.getMonth() && direction > 0) {
            setIsMax(true)
            return;
        }
        setIsMax(false)
        const { startDate, endDate } = getMonthDates(direction); // direction: -1 cho tháng trước, 1 cho tháng sau
        setStartDate(startDate);
        setEndDate(endDate);
    };
    // Nếu chưa có startDate hoặc endDate, đặt mặc định là tháng hiện tại
    useEffect(() => {
        const { startDate, endDate } = getMonthDates(); // Lấy tháng hiện tại
        setStartDate(startDate);
        setEndDate(endDate);
    }, []);

    // Hàm chạy khi component mount hoặc khi startDate/endDate thay đổi
    useEffect(() => {
        if (startDate && endDate) {
            fetchResumeData(); // Fetch lại dữ liệu khi startDate hoặc endDate thay đổi
        }
    }, [startDate, endDate]);


    return (
        <div className="container mt-4">
            {/* Statistics Cards */}
            <Row gutter={[20, 20]}>
                <Col span={24} md={8}>
                    <Card title="Total Users" bordered={false} className="hover-shadow p-3 mb-5 bg-white rounded">
                        <Statistic title="Active Users" value={totalUsers} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={24} md={8}>
                    <Card title="Total Jobs" bordered={false} className="hover-shadow p-3 mb-5 bg-white rounded">
                        <Statistic title="Total Jobs" value={totalJobs} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={24} md={8}>
                    <Card title="Total Companies" bordered={false} className="hover-shadow p-3 mb-5 bg-white rounded">
                        <Statistic title="Total Companies" value={totalCompanies} formatter={formatter} />
                    </Card>
                </Col>
            </Row>

            {/* Line Chart for Resume Growth */}
            <Row gutter={[20, 20]} style={{ marginTop: '20px' }}>
                <Col span={24}>
                    <Card title="Resume Growth Over Time" bordered={false} className="hover-shadow p-3 mb-5 bg-white rounded">

                        <div style={{ marginBottom: '10px', paddingLeft: "85%", textAlign: 'left' }}>
                            <Button onClick={() => handleMonthChange(-1)}>&lt; </Button>

                            <Button onClick={() => handleMonthChange(1)} style={{ marginLeft: '10px', backgroundColor: isMax ? "gray" : "white" }}
                            >
                                &gt;
                            </Button>
                        </div>

                        <Line
                            data={resumeData.map(item => ({
                                date: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}-${item._id.day.toString().padStart(2, '0')}`,
                                value: item.count,
                            }))}
                            xField="date"
                            yField="value"
                            point={{ size: 5, shape: 'diamond' }}
                            label={{
                                position: 'middle',
                                style: { fill: '#ffffff' },
                            }}
                            xAxis={{
                                title: {
                                    text: 'Date',
                                },
                            }}
                            yAxis={{
                                title: {
                                    text: 'Number of Resumes',
                                },
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;

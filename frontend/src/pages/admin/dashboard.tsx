
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Statistic, Table } from "antd";
import { Bar, Line, Pie } from '@ant-design/charts';
import CountUp from 'react-countup';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import './dashboard.css';
import { callNumberOfCompany, callNumberOfJobs, callNumberOfResumeOverTime, callNumberOfUser, callNumberOfUserByRole, callJobLevelData, callTopCompanies } from '@/config/api'; // Make sure the API is imported
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

    const [totalJobs, setTotalJobs] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalCompanies, setTotalCompanies] = useState<number>(0);
    const [resumeData, setResumeData] = useState<any[]>([]); // Lưu trữ dữ liệu số lượng resume theo ngày
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isMax, setIsMax] = useState(false);
    const [usersByRole, setUsersByRole] = useState<any[]>([]); // State to store users by role data
    const [jobLevelData, setJobLevelData] = useState<any[]>([]);
    const [topCompanies, setTopCompanies] = useState<{ company: string, jobs: number }[]>([]);

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
                const roleResponse = await callNumberOfUserByRole();
                setUsersByRole(roleResponse.data);

                const jobLevelResponse = await callJobLevelData();
                setJobLevelData(jobLevelResponse.data);

                const topCompaniesResponse = await callTopCompanies();
                setTopCompanies(topCompaniesResponse.data);
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

                <Col span={12}>
                    <Card title="Users by Role">
                        <Table
                            dataSource={usersByRole}
                            columns={[
                                { title: 'Role', dataIndex: 'role' },
                                { title: 'User Count', dataIndex: 'count' },
                            ]}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Job Levels Distribution">
                        <Pie
                            data={jobLevelData}
                            angleField="value"
                            colorField="type"
                            label={{ type: 'inner', offset: '-50%', content: '{percentage}' }}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[20, 20]} style={{ marginTop: '20px' }}>
                <Col span={24}>
                    <Card title="Top 5 Companies by Job Count">
                        <Bar
                            data={topCompanies}
                            xField="company"
                            yField="jobs"
                            color="lightblue"
                            legend={false}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;





// import React, { useEffect, useState } from 'react';
// import { Button, Card, Col, Row, Statistic, Table, Tag, Progress } from 'antd';
// import { Line, Bar, Pie } from '@ant-design/charts';
// import CountUp from 'react-countup';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './dashboard.css';

// // Fake data for the dashboard
// const fakeData = {
//     totalJobs: 1200,
//     totalUsers: 850,
//     totalCompanies: 350,
//     totalResumesToday: 80,
//     newSubscribers: 30,
//     jobTypes: [
//         { type: 'Frontend', value: 400 },
//         { type: 'Backend', value: 350 },
//         { type: 'Full Stack', value: 250 },
//         { type: 'Data Scientist', value: 150 },
//         { type: 'DevOps', value: 100 },
//     ],
//     usersByRole: [
//         { role: 'Admin', count: 50 },
//         { role: 'Recruiter', count: 100 },
//         { role: 'User', count: 700 },
//         { role: 'Guest', count: 50 },
//     ],
//     companiesByRegion: [
//       { region: 'Hà Nội', count: 120, latitude: 21.0285, longitude: 105.8542 },
//       { region: 'Hồ Chí Minh', count: 250, latitude: 10.8231, longitude: 106.6297 },
//       { region: 'Đà Nẵng', count: 100, latitude: 16.0471, longitude: 108.2068 },
//       { region: 'Cần Thơ', count: 80, latitude: 10.0455, longitude: 105.7469 },
//   ],
//     resumesData: [
//         { date: '2024-05-01', count: 20 },
//         { date: '2024-05-02', count: 35 },
//         { date: '2024-05-03', count: 50 },
//         { date: '2024-05-04', count: 45 },
//         { date: '2024-05-05', count: 60 },
//     ],
//     jobLevelData: [
//         { type: 'Junior', value: 300 },
//         { type: 'Mid', value: 500 },
//         { type: 'Senior', value: 400 },
//     ],
//     topCompanies: [
//         { company: 'ABC Corp', jobs: 120 },
//         { company: 'XYZ Ltd', jobs: 95 },
//         { company: 'TechPro', jobs: 80 },
//         { company: 'InnovateX', jobs: 70 },
//         { company: 'DevFactory', jobs: 65 },
//     ],
//     resumesTableData: [
//         { key: '1', name: 'John Doe', email: 'john@example.com', date: '2024-05-05' },
//         { key: '2', name: 'Jane Smith', email: 'jane@example.com', date: '2024-05-05' },
//         { key: '3', name: 'Alice Brown', email: 'alice@example.com', date: '2024-05-04' },
//     ],
//     notifications: [
//         { key: '1', message: 'New job posted: Frontend Developer at ABC Corp', date: '2024-05-05' },
//         { key: '2', message: 'Jane Smith submitted a resume', date: '2024-05-04' },
//         { key: '3', message: 'New subscriber: Tech World', date: '2024-05-03' },
//     ],
// };

// const DashboardPage = () => {
//     const [totalJobs, setTotalJobs] = useState<number>(0);
//     const [totalUsers, setTotalUsers] = useState<number>(0);
//     const [totalCompanies, setTotalCompanies] = useState<number>(0);
//     const [totalResumesToday, setTotalResumesToday] = useState<number>(0);
//     const [newSubscribers, setNewSubscribers] = useState<number>(0);
//     const [jobTypes, setJobTypes] = useState<any[]>([]);
//     const [usersByRole, setUsersByRole] = useState<any[]>([]);
//     const [companiesByRegion, setCompaniesByRegion] = useState<any[]>([]);
//     const [resumesData, setResumesData] = useState<any[]>([]);
//     const [jobLevelData, setJobLevelData] = useState<any[]>([]);
//     const [topCompanies, setTopCompanies] = useState<any[]>([]);
//     const [resumesTableData, setResumesTableData] = useState<any[]>([]);
//     const [notifications, setNotifications] = useState<any[]>([]);

//     useEffect(() => {
//         // Load fake data
//         setTotalJobs(fakeData.totalJobs);
//         setTotalUsers(fakeData.totalUsers);
//         setTotalCompanies(fakeData.totalCompanies);
//         setTotalResumesToday(fakeData.totalResumesToday);
//         setNewSubscribers(fakeData.newSubscribers);
//         setJobTypes(fakeData.jobTypes);
//         setUsersByRole(fakeData.usersByRole);
//         setCompaniesByRegion(fakeData.companiesByRegion);
//         setResumesData(fakeData.resumesData);
//         setJobLevelData(fakeData.jobLevelData);
//         setTopCompanies(fakeData.topCompanies);
//         setResumesTableData(fakeData.resumesTableData);
//         setNotifications(fakeData.notifications);
//     }, []);

//     const formatter = (value: number | string) => <CountUp end={Number(value)} separator="," />;

//     return (
//         <div className="container mt-4">
//             {/* Thống kê */}
//             <Row gutter={[20, 20]}>
//                 <Col span={8}><Card title="Total Users"><Statistic value={totalUsers} formatter={formatter} /></Card></Col>
//                 <Col span={8}><Card title="Total Jobs"><Statistic value={totalJobs} formatter={formatter} /></Card></Col>
//                 <Col span={8}><Card title="Total Companies"><Statistic value={totalCompanies} formatter={formatter} /></Card></Col>
//                 <Col span={8}><Card title="Resumes Submitted Today"><Statistic value={totalResumesToday} formatter={formatter} /></Card></Col>
//                 <Col span={8}><Card title="New Subscribers"><Statistic value={newSubscribers} formatter={formatter} /></Card></Col>
//             </Row>

//             {/* Biểu đồ tăng trưởng Resumes */}
//             <Row style={{ marginTop: '20px' }}>
//                 <Col span={12}>
//                     <Card title="Resume Growth Over Time">
//                         <Line
//                             data={resumesData}
//                             xField="date"
//                             yField="count"
//                             point={{ size: 5 }}
//                             xAxis={{ title: { text: 'Date' } }}
//                             yAxis={{ title: { text: 'Resumes' } }}
//                         />
//                     </Card>
//                 </Col>

//                 {/* Biểu đồ Jobs theo Level */}
//                 <Col span={12}>
//                     <Card title="Job Levels Distribution">
//                         <Pie
//                             data={jobLevelData}
//                             angleField="value"
//                             colorField="type"
//                             label={{ type: 'inner', offset: '-50%', content: '{percentage}' }}
//                         />
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Biểu đồ Top Companies */}
//             <Row style={{ marginTop: '20px' }}>
//                 <Col span={12}>
//                     <Card title="Top 5 Companies by Job Count">
//                         <Bar
//                             data={topCompanies}
//                             xField="jobs"
//                             yField="company"
//                             color="lightblue"
//                             legend={false}
//                         />
//                     </Card>
//                 </Col>

//                 {/* Biểu đồ loại công việc */}
//                 <Col span={12}>
//                     <Card title="Job Types Distribution">
//                         <Pie
//                             data={jobTypes}
//                             angleField="value"
//                             colorField="type"
//                             label={{ type: 'inner', offset: '-50%', content: '{percentage}' }}
//                         />
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Thanh tiến trình - Tiến độ công việc */}
//             <Row style={{ marginTop: '20px' }}>
//                 <Col span={12}>
//                     <Card title="Job Completion Progress">
//                         <Progress percent={60} status="active" />
//                     </Card>
//                 </Col>

//                 {/* Bảng người dùng theo vai trò */}
//                 <Col span={12}>
//                     <Card title="Users by Role">
//                         <Table
//                             dataSource={usersByRole}
//                             columns={[
//                                 { title: 'Role', dataIndex: 'role' },
//                                 { title: 'User Count', dataIndex: 'count' },
//                             ]}
//                         />
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Bản đồ công ty theo khu vực */}
//             <Row style={{ marginTop: '20px' }}>
//                 <Col span={24}>
//                     <Card title="Companies by Region">
//                         <MapContainer center={[20.0, 105.0]} zoom={6} style={{ height: '400px' }}>
//                             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                             {companiesByRegion.map((region) => (
//                                 <Marker key={region.region} position={[region.latitude, region.longitude]}>
//                                     <Popup>{`${region.region}: ${region.count} companies`}</Popup>
//                                 </Marker>
//                             ))}
//                         </MapContainer>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Bảng danh sách Resumes */}
//             <Row style={{ marginTop: '20px' }}>
//                 <Col span={24}>
//                     <Card title="Latest Resumes">
//                         <Table
//                             dataSource={resumesTableData}
//                             columns={[
//                                 { title: 'Name', dataIndex: 'name' },
//                                 { title: 'Email', dataIndex: 'email' },
//                                 { title: 'Submitted Date', dataIndex: 'date' },
//                             ]}
//                         />
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Thông báo */}
//             <Row style={{ marginTop: '20px' }}>
//                 <Col span={24}>
//                     <Card title="Recent Notifications">
//                         {notifications.map((notif) => (
//                             <Tag color="blue" key={notif.key} style={{ marginBottom: '5px' }}>
//                                 {notif.date}: {notif.message}
//                             </Tag>
//                         ))}
//                     </Card>
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default DashboardPage;

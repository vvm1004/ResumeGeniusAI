import React from "react";
import { Row, Col } from "antd";
import "./Footer.css"; // Make sure to create and use this CSS file for custom styles
import linkedin from "../../assets/linkedin_icon.png";
import facebook from "../../assets/facebook_icon.png";
import insta from "../../assets/insta_logo.png";
import tiktok from "../../assets/tiktok_logo.png";
import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";

const Footer: React.FC = () => {
  const location = useLocation();

  if (location.pathname.startsWith("/resumes/edit/")) {
    return null;
  }
  if (location.pathname.startsWith("/resumes/view")) {
    return null;
  }
  // return (
  //   <footer className="footer bg-dark text-light py-4">
  //     <Container className="main-content">
  //       <Col className="text-center mb-3">
  //         <Row>
  //           <h3>Connect with us on social media</h3>
  //           <ul className="list-inline d-flex justify-content-start">
  //             <li className="list-inline-item mx-2">
  //               <a href="#">
  //                 <img src={linkedin} alt="LinkedIn" />
  //               </a>
  //             </li>
  //             <li className="list-inline-item mx-2">
  //               <a href="#">
  //                 <img src={insta} alt="Instagram" />
  //               </a>
  //             </li>
  //             <li className="list-inline-item mx-2">
  //               <a href="#">
  //                 <img src={tiktok} alt="TikTok" />
  //               </a>
  //             </li>
  //             <li className="list-inline-item mx-2">
  //               <a href="#">
  //                 <img src={facebook} alt="Facebook" />
  //               </a>
  //             </li>
  //           </ul>

  //           <p>Copyright © 2024 - Resume.io</p>
  //         </Row>
  //       </Col>
  //       <Col className="text-center services-text">
  //         <Row>
  //           <ul className="">
  //             <li>
  //               <a href="#">Create a Resume</a>
  //             </li>
  //           </ul>
  //         </Row>
  //       </Col>
  //       <Col className="text-center services-text">
  //         <Row>
  //           <ul className="">
  //             <li>
  //               <a href="#">Job Search</a>
  //             </li>
  //           </ul>
  //         </Row>
  //       </Col>
  //       <Col className="text-center services-text">
  //         <Row>
  //           <ul className="">
  //             <li>
  //               <a href="#">Resume Template</a>
  //             </li>
  //           </ul>
  //         </Row>
  //       </Col>
  //     </Container>
  //     <Col className="text-center mt-4">
  //       <Col>
  //         <p>
  //           More than a resume. Resume.io is a part of <a href="#">career.io</a>{" "}
  //           product ecosystem.
  //         </p>
  //       </Col>
  //     </Col>
  //   </footer>
  // );

  return (
    <footer className="p-4 bg-dark text-light">
      <div className="container">
        <Row gutter={[10, 10]}>
          <Col span={11}>
            <div className="text-center">
              <h3 className="p-2 text-lg text-white font-bold">
                Smart CV Creator
              </h3>
              <div>
                Create a professional CV quickly with the help of AI. Help you
                stand out in the eyes of employers. With a friendly interface
                and a variety of CV templates, AI Resume Builder helps save time
                and optimize your profile. We are committed to providing
                effective tools to help you achieve your dream job more easily.
              </div>
            </div>
          </Col>

          <Col span={5}>
            <div className="text-center">
              <h3 className="p-2 text-lg text-white font-bold">Quick Links</h3>
              <ul className="w-full text-sm space-y-2">
                <li>
                  <a href="/resumes" className="hover:underline">
                    My Resumes
                  </a>
                </li>
                <li>
                  <a href="/jobsAll" className="hover:underline">
                    Job
                  </a>
                </li>
                <li>
                  <a href="/#" className="hover:underline">
                    Frequently Asked Questions
                  </a>
                </li>
                <li>
                  <a href="/#" className="hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </Col>

          <Col span={8}>
            <div className="text-center">
              <h3 className="p-2 text-lg text-white font-bold">
                Contact information
              </h3>
              <ul className="w-full text-sm space-y-2">
                <li className="hover:underline">
                  Email: support@airesumebuilder.com
                </li>
                <li className="hover:underline">Phone: +84 123 456 789</li>
                <li className="hover:underline">
                  Address: 123 ABC Street, XYZ District, Da Nang City
                </li>
              </ul>
              <ul className="mt-4 w-full list-inline">
                <li className="list-inline-item mx-2">
                  <a href="#">
                    <img src={linkedin} alt="LinkedIn" />
                  </a>
                </li>
                <li className="list-inline-item mx-2">
                  <a href="#">
                    <img src={insta} alt="Instagram" />
                  </a>
                </li>
                <li className="list-inline-item mx-2">
                  <a href="#">
                    <img src={tiktok} alt="TikTok" />
                  </a>
                </li>
                <li className="list-inline-item mx-2">
                  <a href="#">
                    <img src={facebook} alt="Facebook" />
                  </a>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          <p>&copy; 2024 AI Resume Builder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

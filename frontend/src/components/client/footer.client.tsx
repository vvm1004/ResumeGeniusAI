import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css"; // Make sure to create and use this CSS file for custom styles
import linkedin from "../../assets/linkedin_icon.png";
import facebook from "../../assets/facebook_icon.png";
import insta from "../../assets/insta_logo.png";
import tiktok from "../../assets/tiktok_logo.png";
import { useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const location = useLocation();

  if (location.pathname.startsWith("/resumes/edit/")) {
    return null;
  }
  if (location.pathname.startsWith("/resumes/view")) {
    return null;
  }
  return (
    <footer className="footer bg-dark text-light py-4">
      <Container className="main-content">
        <Col className="text-center mb-3">
          <Row>
            <h3>Connect with us on social media</h3>
            <ul className="list-inline d-flex justify-content-start">
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

            <p>Copyright © 2024 - Resume.io</p>
          </Row>
        </Col>
        <Col className="text-center services-text">
          <Row>
            <ul className="">
              <li>
                <a href="#">Create a Resume</a>
              </li>
            </ul>
          </Row>
        </Col>
        <Col className="text-center services-text">
          <Row>
            <ul className="">
              <li>
                <a href="#">Job Search</a>
              </li>
            </ul>
          </Row>
        </Col>
        <Col className="text-center services-text">
          <Row>
            <ul className="">
              <li>
                <a href="#">Resume Template</a>
              </li>
            </ul>
          </Row>
        </Col>
      </Container>
      <Col className="text-center mt-4">
        <Col>
          <p>
            More than a resume. Resume.io is a part of <a href="#">career.io</a>{" "}
            product ecosystem.
          </p>
        </Col>
      </Col>
    </footer>
  );
};

export default Footer;

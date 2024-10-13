import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';  // Make sure to create and use this CSS file for custom styles
import linkedin from '../../assets/linkedin_icon.png';
import facebook from '../../assets/facebook_icon.png';
import insta from '../../assets/insta_logo.png';
import tiktok from '../../assets/tiktok_logo.png';



const Footer: React.FC = () => {
    return (
        <footer className="footer bg-dark text-light py-4">
            <Container className='main-content'>
                <Col className="text-center mb-3">
                    <Row>
                        <h3>Connect with us on social media</h3>
                        <ul className="list-inline d-flex justify-content-start">
                            <li className="list-inline-item mx-2">
                                <a href="#"><img src={linkedin} alt="LinkedIn" /></a>
                            </li>
                            <li className="list-inline-item mx-2">
                                <a href="#"><img src={insta} alt="Instagram" /></a>
                            </li>
                            <li className="list-inline-item mx-2">
                                <a href="#"><img src={tiktok} alt="TikTok" /></a>
                            </li>
                            <li className="list-inline-item mx-2">
                                <a href="#"><img src={facebook} alt="Facebook" /></a>
                            </li>
                        </ul>

                        <p>Copyright © 2024 - Resume.io</p>
                    </Row>
                </Col>
                <Col className="text-center services-text">
                    <Col md={3}>
                        <h5>Job Seekers</h5>
                        <ul className="list-unstyled">
                            <li><a href="#">Create a Resume</a></li>
                            <li><a href="#">Resume Examples</a></li>
                            <li><a href="#">Resume Templates</a></li>
                            <li><a href="#">Cover Letter Templates</a></li>
                            <li><a href="#">Job Search</a></li>
                        </ul>
                    </Col>
                    <Col md={3}>
                        <h5>Career Resources</h5>
                        <ul className="list-unstyled">
                            <li><a href="#">Resume Help</a></li>
                            <li><a href="#">Job Interview</a></li>
                            <li><a href="#">Career</a></li>
                            <li><a href="#">Cover Letters</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </Col>
                    <Col md={3}>
                        <h5>Our Company</h5>
                        <ul className="list-unstyled">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Pricing</a></li>
                            <li><a href="#">Sponsorship Program</a></li>
                            <li><a href="#">Media Kit</a></li>
                            <li><a href="#">Affiliates</a></li>
                        </ul>
                    </Col>
                    <Col md={3}>
                        <h5>Support</h5>
                        <ul className="list-unstyled">
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Privacy</a></li>
                            <li><a href="#">Right of Withdrawal</a></li>
                        </ul>
                    </Col>
                </Col>

            </Container>
            <Col className="text-center mt-4">
                <Col>
                    <p>More than a resume. Resume.io is a part of <a href="#">career.io</a> product ecosystem.</p>
                </Col>
            </Col>
        </footer>
    );
};

export default Footer;

import { AtomIcon, Edit, Share2 } from 'lucide-react'
import './index.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useState } from 'react';
import Slider from 'react-slick';
import { useNavigate } from "react-router-dom";

import resume1 from '../../assets/template.png';
import resume2 from '../../assets/template1.png';
import resume3 from '../../assets/template2.png';
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from '../Resume/Upload/Modal';

const resumeImages = [
    resume1,
    resume2,
    resume3,
    resume1,
    resume2,
    resume3

];
const Home: React.FC = () => {
    const [showSlider, setShowSlider] = useState(false);
    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        draggable: true, // Kích hoạt tính năng kéo thả
    };
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const access_token = localStorage.getItem("access_token");
    const userId = useSelector((state: any) => state.account.user._id || "");

    const navigate = useNavigate();

    const [isOpenLoading, setIsOpenLoading] = useState(false);

    const OpenLoading = () => setIsOpenLoading(true);
    const CloseLoading = () => setIsOpenLoading(false);
    const handleButtonClick = () => {
        fileInputRef.current?.click(); // Mở hộp thoại chọn file
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        OpenLoading()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', String(userId));

        try {
            const response = await axios.post('http://localhost:8000/api/v1/resume-upgrade/upload-resume', formData);
            const uploadData = response.data.data;

            if (userId) {
                const response2 = await axios.post(
                    "http://localhost:8000/api/v1/resume-builders",
                    uploadData,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                );
                navigate(`resumes/edit/${response2.data.data._id}`);
            } else {
                alert("User ID không hợp lệ.");
            }
        } catch (error: unknown) { // Ép kiểu cho error
            if (axios.isAxiosError(error)) {
                // Nếu là lỗi từ axios, có thể truy cập response
                console.error('Error uploading file:', error);
                alert(error.response ? error.response.data : "Có lỗi xảy ra khi upload file.");
            } else {
                console.error('Unexpected error:', error);
                alert("Có lỗi xảy ra, vui lòng thử lại.");
            }
        }
    };
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleClick = () => {
        navigate("/resumes", { state: { shouldCallHandleNewResumeClick: true } });
    };








    return (

        <div className="container homepage">
            <section className="title">
                <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">


                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                        Build Your Resume <span className='text-primary'>With AI</span> </h1>
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Effortlessly Craft a Standout Resume with Our AI-Powered Builder</p>
                    <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={handleClick}
                            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-pink-700 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
                        >
                            Get Started
                            <svg
                                className="ml-2 -mr-1 w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                        </button>
                        <a onClick={openModal} className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                            Upgrade Resume
                        </a>

                    </div>
                </div >
            </section >

            <section className="py-8 bg-white z-50 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                <h2 className="font-bold text-3xl">How it Works?</h2>
                <h2 className="text-md text-gray-500">
                    Give mock interview in just 3 simplar easy step
                </h2>

                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <a
                        className="block rounded-xl border bg-white
                                border-gray-200 p-8 shadow-xl transition
                                hover:border-pink-500/10 hover:shadow-pink-500/10"
                        href="#"
                    >
                        <AtomIcon className="h-8 w-8" />

                        <h2 className="mt-4 text-xl font-bold text-black">
                            Write promot for your form
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo
                            possimus adipisci distinctio alias voluptatum blanditiis
                            laudantium.
                        </p>
                    </a>

                    <a
                        className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
                        href="#"
                    >
                        <Edit className="h-8 w-8" />

                        <h2 className="mt-4 text-xl font-bold text-black">
                            Edit Your form{" "}
                        </h2>


                        <p className="mt-1 text-sm text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci
                            distinctio alias voluptatum blanditiis laudantium.
                        </p>
                    </a >

                    <a
                        className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
                        href="#"
                    >
                        <Share2 className='h-8 w-8' />

                        <h2 className="mt-4 text-xl font-bold text-black">Share & Start Accepting Responses</h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci
                            distinctio alias voluptatum blanditiis laudantium.
                        </p>
                    </a>


                </div >

                <div className="mt-12 text-center">
                    <button
                        onClick={handleClick}
                        className="inline-block rounded bg-purple-500 px-12 py-3 text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus:ring focus:ring-yellow-400"
                    >
                        Get Started Today
                    </button>
                </div>
            </section >

            <section className="home-resume-maker__header-content">
                <div className="grid-container">
                    <div className="home-resume-maker__header">
                        <div
                            className="home-resume-maker__header-visual is-image-loaded"
                            data-lazy-bg="https://resume.io/assets/landing/home/resume-maker/visual-87d13523d51b0859e264c50170556aa75eb349bfb1a8904ff460c6b89fc15808.svg"
                            style={{
                                backgroundImage:
                                    'url("https://resume.io/assets/landing/home/resume-maker/visual-87d13523d51b0859e264c50170556aa75eb349bfb1a8904ff460c6b89fc15808.svg")'
                            }}
                        />
                        <div className="home-resume-maker__header-content title-content">
                            <h2 className="home-resume-maker__header-title section__title">
                                Use the best resume maker as your guide
                            </h2>
                            <div className="home-resume-maker__header-description">
                                Getting that dream job can seem like an impossible task. We’re here to
                                change that. Give yourself a real advantage with the best online
                                resume maker: created by experts, improved by data, trusted by
                                millions of professionals.
                            </div>
                            <div className="home-resume-maker__header-actions">
                                <button
                                    className="inline-flex ms-4 justify-center items-center py-3 px-5 text-base font-medium text-center bg-purple text-white rounded-lg border border-gray-300 hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                                    onClick={handleClick}
                                >
                                    Create my resume
                                </button>

                                <a onClick={openModal} className="inline-flex  ms-4 justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                    Upgrade Resume
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="home-resume-maker__features">
                        <div className="home-resume-maker__feature">
                            <div
                                className="home-resume-maker__feature-icon is-image-loaded"
                                data-lazy-bg="https://resume.io/assets/landing/home/resume-maker/feature-1-edf4481d69166ac81917d1e40e6597c8d61aa970ad44367ce78049bf830fbda5.svg"
                                style={{
                                    backgroundImage:
                                        'url("https://resume.io/assets/landing/home/resume-maker/feature-1-edf4481d69166ac81917d1e40e6597c8d61aa970ad44367ce78049bf830fbda5.svg")'
                                }}
                            />
                            <strong className="home-resume-maker__feature-title">
                                Make a resume that wins interviews
                            </strong>
                            <div className="home-resume-maker__feature-description">
                                <p>
                                    Use our resume maker with its advanced creation tools to tell a
                                    professional story that engages recruiters, hiring managers and even
                                    CEOs.
                                </p>
                            </div>
                        </div>
                        <div className="home-resume-maker__feature">
                            <div
                                className="home-resume-maker__feature-icon is-image-loaded"
                                data-lazy-bg="https://resume.io/assets/landing/home/resume-maker/feature-2-a7a471bd973c02a55d1b3f8aff578cd3c9a4c5ac4fc74423d94ecc04aef3492b.svg"
                                style={{
                                    backgroundImage:
                                        'url("https://resume.io/assets/landing/home/resume-maker/feature-2-a7a471bd973c02a55d1b3f8aff578cd3c9a4c5ac4fc74423d94ecc04aef3492b.svg")'
                                }}
                            />
                            <strong className="home-resume-maker__feature-title">
                                Resume writing made easy
                            </strong>
                            <div className="home-resume-maker__feature-description">
                                <p>
                                    Resume writing has never been this effortless. Pre-generated text,
                                    visual designs and more - all already integrated into the resume
                                    maker. Just fill in your details.
                                </p>
                            </div>
                        </div>
                        <div className="home-resume-maker__feature">
                            <div
                                className="home-resume-maker__feature-icon is-image-loaded"
                                data-lazy-bg="https://resume.io/assets/landing/home/resume-maker/feature-3-4e87a82f83e260488c36f8105e26f439fdc3ee5009372bb5e12d9421f32eabdd.svg"
                                style={{
                                    backgroundImage:
                                        'url("https://resume.io/assets/landing/home/resume-maker/feature-3-4e87a82f83e260488c36f8105e26f439fdc3ee5009372bb5e12d9421f32eabdd.svg")'
                                }}
                            />
                            <strong className="home-resume-maker__feature-title">
                                A recruiter-tested CV maker tool
                            </strong>
                            <div className="home-resume-maker__feature-description">
                                <p>
                                    <a href="https://resume.io/resume-builder">Our resume builder</a>{" "}
                                    and its pre-generated content are tested by recruiters and IT
                                    experts. We help your resume become truly competitive in the hiring
                                    process.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="home-resume-maker__lightbox">
                        <div className="home-resume-maker__lightbox-content" />
                        <div className="home-resume-maker__lightbox-close" />
                    </div>
                </div>
            </section>

            <section className="resume-section py-5">
                <div className="container text-center try-our-ai">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <h2 className="mb-4  text-start">Try our AI to upgrade your Resume now!</h2>
                            <p className="mb-4 text-start">
                                Quickly upgrade and create the perfect fresh resume that employers love.
                            </p>
                            <div className="d-flex justify-content-center">
                                <a onClick={openModal} className="inline-flex ms-4 justify-center items-center py-3 px-5 text-base font-medium text-center bg-purple text-white rounded-lg border border-gray-300 hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                    Upgrade my resume
                                </a>

                                <a className="inline-flex  ms-4 justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                    Resume Examples
                                </a>                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center mt-5 position-relative three-images">
                        <div className="resume-images">
                            <img
                                src={resume1}
                                alt="Resume 1"
                                className="img-fluid resume-image resume-image-1"
                            />
                            <img
                                src={resume2}
                                alt="Resume 2"
                                className="img-fluid resume-image resume-image-2"
                            />
                            <img
                                src={resume3}
                                alt="Resume 3"
                                className="img-fluid resume-image resume-image-3"
                            />
                        </div>
                    </div>
                </div>
            </section>


            <section className="resume-template-section">
                <div className="container py-5">
                    <div className="row">
                        <div className="template-example ">
                            {!showSlider && (
                                <><div className="col-lg-6 tem-content">
                                    <div className="text-content">
                                        <h2>Beautiful ready-to-use resume templates</h2>
                                        <p>
                                            Win over employers and recruiters by using one of our 25+
                                            elegant, professionally-designed resume templates. Download to
                                            word or PDF.
                                        </p>
                                        <a href="/dashboard" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-pink-700 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                                            Select Template
                                        </a>
                                    </div>
                                </div>
                                    <div className="col-lg-6 tem ">
                                        <button
                                            className="toggle-btn"
                                            onClick={() => setShowSlider(!showSlider)}
                                        >
                                            {showSlider ? '>>' : '<<'}
                                        </button>
                                        <div className="resume-slider template-imgs d-flex justify-content-between">
                                            {resumeImages.slice(0, 3).map((image, index) => (
                                                <div key={index} className="slider-item mx-2">
                                                    <img
                                                        src={image}
                                                        alt={`Resume template ${index + 1}`}
                                                        className="img-fluid"
                                                        style={{
                                                            borderRadius: "0px",
                                                            width: "900px",     // Đảm bảo hình ảnh co giãn theo chiều ngang
                                                            height: "400px",    // Giữ tỉ lệ ảnh đúng
                                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                    </div></>

                            )}
                        </div>
                        <div className="col-lg-6 position-relative">
                            <button
                                className="toggle-btn"
                                onClick={() => setShowSlider(!showSlider)}
                            >
                                {showSlider ? '>>' : ''}
                            </button>

                            {showSlider && (
                                <div className="resume-slider">
                                    <Slider {...sliderSettings}>
                                        {resumeImages.map((image, index) => (
                                            <div key={index} className="slider-item ">
                                                <img
                                                    src={image}
                                                    alt={`Resume template ${index + 1}`}
                                                    className="img-fluid template-image "
                                                    style={{
                                                        borderRadius: "0px",
                                                        width: "300px",     // Đảm bảo hình ảnh co giãn theo chiều ngang
                                                        height: "500px",    // Giữ tỉ lệ ảnh đúng
                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",


                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="faq container mt-5">
                <h2 className="mb-4">Have a Question? Ask Us!</h2>
                <form className="question-form">
                    <div className="mb-3">
                        <label htmlFor="userName" className="form-label">Your Name:</label>
                        <input
                            type="text"
                            id="userName"
                            className="form-control custom-input"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="userEmail" className="form-label">Your Email:</label>
                        <input
                            type="email"
                            id="userEmail"
                            className="form-control custom-input"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="userQuestion" className="form-label">Your Question:</label>
                        <textarea
                            id="userQuestion"
                            className="form-control custom-input"
                            rows={4}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary">Send</button>
                </form>
            </section>

            <Modal isOpen={isModalOpen}
                onClose={closeModal}
                handleFileChange={handleFileChange}
                handleButtonClick={handleButtonClick}
                fileInputRef={fileInputRef}
                isLoading={isOpenLoading}
                openLoading={OpenLoading}
            />
        </div>
    );
};

export default Home;

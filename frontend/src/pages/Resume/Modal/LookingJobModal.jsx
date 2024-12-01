

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './LookingJobModal.css';

const LookingJobModal = ({ show, handleClose, data = [], user }) => {

    const [selectedResumes, setSelectedResumes] = useState([]);
    const [resumeRegistrations, setResumeRegistrations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notSelectedResumes, setNotSelectedResumes] = useState([]);
    const API_URL = 'http://localhost:8000/api/v1';
    const [resumeRegistrationsId, setResumeRegistrationsId] = useState([]);
    const [originalResumeRegistrationsId, setOriginalResumeRegistrationsId] = useState([]);

    useEffect(() => {
        if (user._id && show) {
            fetchResumeRegistrations(user._id);
        }
    }, [user._id, show]);


    const fetchResumeRegistrations = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL + `/resume-registration/${user._id}`);
            setResumeRegistrations(response.data);
            if (response.data && Array.isArray(response.data.data)) {
                // Nếu là mảng, tiếp tục xử lý
                setResumeRegistrations(response.data.data);

                const resumeIds = response.data.data.map(item => item.resumeId);
                setResumeRegistrationsId(resumeIds);
                setOriginalResumeRegistrationsId(resumeIds);

                console.log("response.data:", response.data);
            } else {
                // Nếu không phải mảng, xử lý lỗi hoặc trả về mảng rỗng
                console.error("response.data.data is not a valid array", response.data);
                setResumeRegistrations([]);
                setResumeRegistrationsId([]);
                setOriginalResumeRegistrationsId([]);
            }

            console.log("response: ", response.data)
            setLoading(false);
        } catch (error) {
            console.error("Error fetching resume registrations:", error);
            setLoading(false);
        }
        console.log("id: ", resumeRegistrationsId)
        console.log(checkResumeRegistrationExist("672b71f6b3a7fbf4eb911be3"))
    };





    const handleSelectResume = (resume) => {
        if (checkResumeRegistrationExist(resume._id)) {

            setResumeRegistrationsId(prevState => prevState.filter(id => id !== resume._id));

        }
        else {
            setResumeRegistrationsId(prevState => [...prevState, resume._id]);
        }

        setSelectedResumes((prevSelected) => {
            // Kiểm tra nếu resume đã có trong mảng
            const isSelected = prevSelected.some(item => item._id === resume._id);

            if (isSelected) {
                // Nếu đã chọn thì bỏ chọn
                return prevSelected.filter(item => item._id !== resume._id);
            } else {
                // Nếu chưa chọn thì thêm vào
                return [...prevSelected, resume];
            }
        });
    };


    const checkResumeRegistrationExist = (resumeId) => {
        return resumeRegistrationsId.includes(resumeId);
    };
    const checkOriginalResumeRegistrationExist = (resumeId) => {
        return originalResumeRegistrationsId.includes(resumeId);
    };

    const createResumeRegistration = async (resumeId, title, skills) => {
        try {
            await axios.post(API_URL + '/resume-registration', { userId: user._id, email: user.email, resumeId: resumeId, resumeTitle: title, resumeSkill: skills, userName: user.name });
            console.log(`Created ResumeRegistration for ${resumeId}`);
        } catch (error) {
            console.error(`Error creating ResumeRegistration for ${resumeId}:`, error);
        }
    };

    const deleteResumeRegistration = async (resumeId) => {
        try {
            await axios.delete(API_URL + `/resume-registration/${resumeId}`);
            console.log(`Deleted ResumeRegistration for ${resumeId}`);
        } catch (error) {
            console.error(`Error deleting ResumeRegistration for ${resumeId}:`, error);
        }
    };

    const handleEnableClick = async () => {

        console.log("aaaaaaaaaa:", resumeRegistrationsId)

        const selectedIds = selectedResumes.map(resume => resume._id);
        console.log("selectedIds:", selectedIds)

        // 1. Check selected resumes and create new ResumeRegistrations if necessary
        for (const resume of selectedResumes) {
            if (!checkOriginalResumeRegistrationExist(resume._id)) {
                var skills = resume.skills.map(skill => `${skill.title}: ${skill.value}`).join(', ');
                await createResumeRegistration(resume._id, resume.title, skills);
            }
        }
        

        // 3. Collect unselected resumes to check for deletions
        const unselectedResumes = resumeRegistrations.filter(registration => !selectedIds.includes(registration.resumeId));
        setNotSelectedResumes(unselectedResumes);

        // 4. Check for resumes that are unselected but still have a ResumeRegistration, and delete them
        for (const resume of unselectedResumes) {
            if (checkOriginalResumeRegistrationExist(resume.resumeId)) {
                await deleteResumeRegistration(resume.resumeId);
            }
        }

        handleClose();
    };






    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false} className="job-alert-modal modal-overlay">
            <Modal.Header closeButton>
                <Modal.Title>Turn on job search now to not miss out on especially attractive opportunities</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please select the CVs you want to enable job search<br />Or click "I have no need" to skip</p>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Form>
                        <div className="cv-list">
                            {data && data.map((resume, index) => {
                                return (
                                    <Form.Check
                                        key={index}
                                        type="checkbox"
                                        label={<>
                                            {resume.title} <br />
                                            <span style={{ fontSize: 'smaller', color: '#666' }}>
                                                Updated: {new Date(resume.updatedAt).toLocaleDateString('en-GB')}
                                            </span>
                                        </>}
                                        checked={checkResumeRegistrationExist(resume._id)}
                                        onChange={() => handleSelectResume(resume)}

                                    />
                                );
                            })}
                        </div>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="success" onClick={handleEnableClick}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LookingJobModal;
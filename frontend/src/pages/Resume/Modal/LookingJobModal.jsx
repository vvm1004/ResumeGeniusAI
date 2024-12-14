

// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';
// import axios from 'axios';
// import './LookingJobModal.css';

// const LookingJobModal = ({ show, handleClose, data = [], user }) => {

// const [selectedResumes, setSelectedResumes] = useState([]);
// const [resumeRegistrations, setResumeRegistrations] = useState([]);
// const [loading, setLoading] = useState(false);
// const [notSelectedResumes, setNotSelectedResumes] = useState([]);
// const API_URL = 'http://localhost:8000/api/v1';
// const [resumeRegistrationsId, setResumeRegistrationsId] = useState([]);
// const [originalResumeRegistrationsId, setOriginalResumeRegistrationsId] = useState([]);

// useEffect(() => {
//     if (user._id && show) {
//         fetchResumeRegistrations(user._id);
//     }
// }, [user._id, show]);


// const fetchResumeRegistrations = async () => {
//     try {
//         setLoading(true);
//         const response = await axios.get(API_URL + `/resume-registration/${user._id}`);
//         setResumeRegistrations(response.data);
//         if (response.data && Array.isArray(response.data.data)) {
//             // Nếu là mảng, tiếp tục xử lý
//             setResumeRegistrations(response.data.data);

//             const resumeIds = response.data.data.map(item => item.resumeId);
//             setResumeRegistrationsId(resumeIds);
//             setOriginalResumeRegistrationsId(resumeIds);

//             console.log("response.data:", response.data);
//         } else {
//             // Nếu không phải mảng, xử lý lỗi hoặc trả về mảng rỗng
//             console.error("response.data.data is not a valid array", response.data);
//             setResumeRegistrations([]);
//             setResumeRegistrationsId([]);
//             setOriginalResumeRegistrationsId([]);
//         }

//         console.log("response: ", response.data)
//         setLoading(false);
//     } catch (error) {
//         console.error("Error fetching resume registrations:", error);
//         setLoading(false);
//     }
//     console.log("id: ", resumeRegistrationsId)
//     console.log(checkResumeRegistrationExist("672b71f6b3a7fbf4eb911be3"))
// };





// const handleSelectResume = (resume) => {
//     if (checkResumeRegistrationExist(resume._id)) {

//         setResumeRegistrationsId(prevState => prevState.filter(id => id !== resume._id));

//     }
//     else {
//         setResumeRegistrationsId(prevState => [...prevState, resume._id]);
//     }

//     setSelectedResumes((prevSelected) => {
//         // Kiểm tra nếu resume đã có trong mảng
//         const isSelected = prevSelected.some(item => item._id === resume._id);

//         if (isSelected) {
//             // Nếu đã chọn thì bỏ chọn
//             return prevSelected.filter(item => item._id !== resume._id);
//         } else {
//             // Nếu chưa chọn thì thêm vào
//             return [...prevSelected, resume];
//         }
//     });
// };


// const checkResumeRegistrationExist = (resumeId) => {
//     return resumeRegistrationsId.includes(resumeId);
// };
// const checkOriginalResumeRegistrationExist = (resumeId) => {
//     return originalResumeRegistrationsId.includes(resumeId);
// };

// const createResumeRegistration = async (resumeId, title, skills) => {
//     try {
//         await axios.post(API_URL + '/resume-registration', { userId: user._id, email: user.email, resumeId: resumeId, resumeTitle: title, resumeSkill: skills, userName: user.name });
//         console.log(`Created ResumeRegistration for ${resumeId}`);
//     } catch (error) {
//         console.error(`Error creating ResumeRegistration for ${resumeId}:`, error);
//     }
// };

// const deleteResumeRegistration = async (resumeId) => {
//     try {
//         await axios.delete(API_URL + `/resume-registration/${resumeId}`);
//         console.log(`Deleted ResumeRegistration for ${resumeId}`);
//     } catch (error) {
//         console.error(`Error deleting ResumeRegistration for ${resumeId}:`, error);
//     }
// };

// const handleEnableClick = async () => {

//     console.log("aaaaaaaaaa:", resumeRegistrationsId)

//     const selectedIds = selectedResumes.map(resume => resume._id);
//     console.log("selectedIds:", selectedIds)

//     // 1. Check selected resumes and create new ResumeRegistrations if necessary
//     for (const resume of selectedResumes) {
//         if (!checkOriginalResumeRegistrationExist(resume._id)) {
//             var skills = resume.skills;
//             await createResumeRegistration(resume._id, resume.title, skills);
//         }
//     }

//     // 3. Collect unselected resumes to check for deletions
//     const unselectedResumes = resumeRegistrations.filter(registration => !selectedIds.includes(registration.resumeId));
//     setNotSelectedResumes(unselectedResumes);

//     // 4. Check for resumes that are unselected but still have a ResumeRegistration, and delete them
//     for (const resume of unselectedResumes) {
//         if (checkOriginalResumeRegistrationExist(resume.resumeId)) {
//             await deleteResumeRegistration(resume.resumeId);
//         }
//     }

//     handleClose();
// };






//     return (
//         <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false} className="job-alert-modal modal-overlay">
//             <Modal.Header closeButton>
//                 <Modal.Title>Turn on job search now to not miss out on especially attractive opportunities</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <p>Please select the CVs you want to enable job search<br />Or click "I have no need" to skip</p>
//                 {loading ? (
//                     <p>Loading...</p>
//                 ) : (
//                     <Form>
//                         <div className="cv-list">
//                             {data && data.map((resume, index) => {
//                                 return (
//                                     <Form.Check
//                                         key={index}
//                                         type="checkbox"
//                                         label={<>
//                                             {resume.title} <br />
//                                             <span style={{ fontSize: 'smaller', color: '#666' }}>
//                                                 Updated: {new Date(resume.updatedAt).toLocaleDateString('en-GB')}
//                                             </span>
//                                         </>}
//                                         checked={checkResumeRegistrationExist(resume._id)}
//                                         onChange={() => handleSelectResume(resume)}

//                                     />
//                                 );
//                             })}
//                         </div>
//                     </Form>
//                 )}
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={handleClose}>Cancel</Button>
//                 <Button variant="success" onClick={handleEnableClick}>Save</Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default LookingJobModal;
import React, { useState, useEffect } from 'react';
import { Modal, Button, Checkbox, Spin, notification } from 'antd';
import axios from 'axios';
import './LookingJobModal.css';
import { forEach } from 'lodash';

const LookingJobModal = ({ show, handleClose, data = [], user }) => {
    // const [selectedResumes, setSelectedResumes] = useState([]);
    // const [resumeRegistrations, setResumeRegistrations] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [resumeRegistrationsId, setResumeRegistrationsId] = useState([]);
    // const [originalResumeRegistrationsId, setOriginalResumeRegistrationsId] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const API_URL = 'http://localhost:8000/api/v1';

    // useEffect(() => {
    //     if (user._id && show) {
    //         fetchResumeRegistrations(user._id);
    //     }
    // }, [user._id, show]);

    // const fetchResumeRegistrations = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await axios.get(API_URL + `/resume-registration/${user._id}`);
    //         setResumeRegistrations(response.data);
    //         setSelectedResumes(response.data)
    //         console.log("response.data", response.data)

    //         if (response.data && Array.isArray(response.data.data)) {
    //             setResumeRegistrations(response.data.data);
    //             const resumeIds = response.data.data.map(item => item.resumeId);
    //             console.log("\resumeIds ", resumeIds)

    //             setResumeRegistrationsId(resumeIds);
    //             setSelectedResumes(response.data.data)
    //             setOriginalResumeRegistrationsId(resumeIds);
    //         } else {
    //             setResumeRegistrations([]);
    //             setResumeRegistrationsId([]);
    //             setOriginalResumeRegistrationsId([]);
    //         }
    //         setLoading(false);
    //     } catch (error) {
    //         console.error("Error fetching resume registrations:", error);
    //         setLoading(false);
    //     }
    //     console.log("\nselectedResumes ", selectedResumes)
    //     console.log("\nresumeRegistrationsId", resumeRegistrationsId)
    //     console.log("\noriginalResumeRegistrationsId", originalResumeRegistrationsId)


    // };

    // const handleSelectResume = (resume) => {
    //     if (checkResumeRegistrationExist(resume._id)) {
    //         setResumeRegistrationsId(prevState => prevState.filter(id => id !== resume._id));
    //     } else {
    //         setResumeRegistrationsId(prevState => [...prevState, resume._id]);
    //     }

    //     setSelectedResumes((prevSelected) => {
    //         const isSelected = prevSelected.some(item => item._id === resume._id);
    //         return isSelected
    //             ? prevSelected.filter(item => item._id !== resume._id)
    //             : [...prevSelected, resume];
    //     });
    // };

    // const checkResumeRegistrationExist = (resumeId) => {
    //     return resumeRegistrationsId.includes(resumeId);
    // };

    // const checkOriginalResumeRegistrationExist = (resumeId) => {
    //     return originalResumeRegistrationsId.includes(resumeId);
    // };


    // const createResumeRegistration = async (resumeId, title, skills) => {
    //     try {
    //         if (!resumeId) {
    //             throw new Error("resumeId is required");
    //         }

    //         const response = await axios.post(API_URL + '/resume-registration', {
    //             userId: user._id,
    //             userName: user.name,
    //             email: user.email,
    //             resumeId,          // Make sure resumeId is passed
    //             resumeTitle: title,
    //             resumeSkill: skills,
    //         });

    //         console.log("Created ResumeRegistration:", response.data);
    //     } catch (error) {
    //         console.error("Error creating ResumeRegistration:", error);
    //     }
    // };


    // const deleteResumeRegistration = async (resumeId) => {
    //     try {
    //         await axios.delete(API_URL + `/resume-registration/${resumeId}`);
    //         console.log(`Deleted ResumeRegistration for ${resumeId}`);
    //     } catch (error) {
    //         console.error(`Error deleting ResumeRegistration for ${resumeId}:`, error);
    //     }
    // };

    // const handleEnableClick = async () => {
    //     setIsLoading(true)

    //     const selectedIds = selectedResumes.map(resume => resume._id);
    //     console.log("selectedResumes ", selectedResumes)

    //     // 1. Create new ResumeRegistrations for selected resumes
    //     for (const resume of selectedResumes) {
    //         if (!checkOriginalResumeRegistrationExist(resume._id)) {
    //             console.log("Created: ", resume._id)
    //             await createResumeRegistration(resume._id, resume.title, resume.skills);
    //         }
    //     }

    //     // 2. Delete ResumeRegistrations for unselected resumes

    //     const unselectedResumes = resumeRegistrations.filter(registration => !selectedIds.includes(registration.resumeId));

    //     console.log("resumeRegistrations ", resumeRegistrations)

    //     console.log("unselectedResumes ", unselectedResumes)

    //     for (const resume of unselectedResumes) {
    //         if (checkOriginalResumeRegistrationExist(resume.resumeId)) {
    //             await deleteResumeRegistration(resume.resumeId);
    //         }
    //     }
    //     setSelectedResumes([]);
    //     console.log("selectedResumes cancel ", selectedResumes)

    //     handleClose();
    //     setIsLoading(false)
    // };

    const [selectedResumes, setSelectedResumes] = useState([]);
    const [resumeRegistrations, setResumeRegistrations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notSelectedResumes, setNotSelectedResumes] = useState([]);
    const API_URL = 'http://localhost:8000/api/v1';
    const [resumeRegistrationsId, setResumeRegistrationsId] = useState([]);
    const [originalResumeRegistrationsId, setOriginalResumeRegistrationsId] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchResumeRegistrations()
    }, [])
    useEffect(() => {
        if (user._id && show) {
            fetchResumeRegistrations(user._id);
        }
    }, [user._id, show]);

    const openNotification = (type, message) => {
        notification[type]({
            message: message,
            placement: "topRight",
            duration: 2,
        });
    };
    const fetchResumeRegistrations = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL + `/resume-registration/${user._id}`);
            setResumeRegistrations(response.data);
            //setSelectedResumes(response.data)
            if (response.data && Array.isArray(response.data.data)) {
                // Nếu là mảng, tiếp tục xử lý
                setResumeRegistrations(response.data.data);

                const resumeIds = response.data.data.map(item => item.resumeId);
                setResumeRegistrationsId(resumeIds);
                setOriginalResumeRegistrationsId(resumeIds);
                if (Array.isArray(response.data.data)) {
                    const selected = response.data.data.map((resume) => {
                        return data.find((resumeItem) => resumeItem._id === resume.resumeId);
                    }).filter((resume) => resume !== undefined); // Filter out undefined values

                    setSelectedResumes(selected);
                } else {
                    console.error("Expected response.data to be an array, but got:", response.data);
                }

                console.log("response.data:", response.data);
            } else {
                // Nếu không phải mảng, xử lý lỗi hoặc trả về mảng rỗng
                console.error("response.data.data is not a valid array", response.data);
                setResumeRegistrations([]);
                setResumeRegistrationsId([]);
                setOriginalResumeRegistrationsId([]);
            }

            //console.log("response: ", response.data)
            setLoading(false);
        } catch (error) {
            console.error("Error fetching resume registrations:", error);
            setLoading(false);
        }
        //  console.log("id: ", resumeRegistrationsId)
        // console.log("selectedResumes", selectedResumes)
        // console.log(checkResumeRegistrationExist("672b71f6b3a7fbf4eb911be3"))
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
        // console.log("selectedResumes", selectedResumes)
        // console.log("resume", resume)

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
        setIsLoading(true)
        //console.log("\n\n\n\n\selectedResumes:", selectedResumes)

        //console.log("aaaaaaaaaa:", resumeRegistrationsId)

        const selectedIds = selectedResumes.map(resume => resume._id);
        //console.log("selectedIds:", selectedIds)

        // 1. Check selected resumes and create new ResumeRegistrations if necessary
        try {


            for (const resume of selectedResumes) {
                if (!checkOriginalResumeRegistrationExist(resume._id)) {
                    //console.log("checkOriginalResumeRegistrationExist(resume._id): ", checkOriginalResumeRegistrationExist(resume._id))
                    var skills = resume.skills;
                    await createResumeRegistration(resume._id, resume.title, skills);
                }
            }
            //console.log("\n\n\n\n\nresumeRegistrations:", resumeRegistrations)

            // 3. Collect unselected resumes to check for deletions
            const unselectedResumes = resumeRegistrations.filter(registration => !selectedIds.includes(registration.resumeId));
            //console.log("\n\n\n\n\nnselectedResumes:", unselectedResumes)
            //console.log("\n\n\n\n\nriginalResumeRegistrationsId:", originalResumeRegistrationsId)

            setNotSelectedResumes(unselectedResumes);

            // 4. Check for resumes that are unselected but still have a ResumeRegistration, and delete them
            for (const resume of unselectedResumes) {
                if (checkOriginalResumeRegistrationExist(resume.resumeId)) {

                    await deleteResumeRegistration(resume.resumeId);
                }
            }

            openNotification("success", "Register successfully!");

        } catch (error) {
            openNotification(
                "error",
                "An error occurred while registration. Please try again."
            )
        }
        setIsLoading(false)
        // setSelectedResumes([]);

        handleClose();

    };

    const cancel = async () => {
        // setSelectedResumes([]);

        handleClose();

    }

    return (
        <Modal
            visible={show}
            onCancel={cancel}
            footer={null}
            centered
            width={800}
            title="Turn on job search now to not miss out on especially attractive opportunities"
            className="job-alert-modal"
        >
            <p>Please select the CVs you want to enable job search<br />Or click "I have no need" to skip</p>
            {loading ? (
                <Spin size="large" />
            ) : (
                <div className="cv-list">
                    {data && data.map((resume, index) => (
                        <Checkbox
                            key={index}
                            checked={checkResumeRegistrationExist(resume._id)}
                            onChange={() => handleSelectResume(resume)}
                        >
                            <div>
                                <strong>{resume.title}</strong>
                                <br />
                                <small style={{ color: '#666' }}>Updated: {new Date(resume.updatedAt).toLocaleDateString('en-GB')}</small>
                            </div>
                        </Checkbox>
                    ))}
                </div>
            )}

            <div className="modal-footer">
                <Button onClick={handleClose} style={{ marginRight: 8 }}>Cancel</Button>
                <Button type="primary" onClick={handleEnableClick}>Save</Button>
            </div>
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="loader"></div>
                </div>
            )}
        </Modal>
    );
};

export default LookingJobModal;

import axios from "axios";


// const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ,
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${API_KEY}`
    // }
})


const CreateNewResume = (data) => axiosClient.post('/api/v1', data);

const GetUserResumes = (userEmail) => axiosClient.get('/api/v1?userEmail=' + userEmail);

const UpdateResumeDetail = (id, data) => axiosClient.put(`/api/v1/${id}`, data)

const GetResumeById = (id) => axiosClient.get(`/api/v1/${id}` )

const DeleteResumeById = (id) => axiosClient.delete(`/api/v1/${id}`)

export default {
    CreateNewResume,
    GetUserResumes,
    UpdateResumeDetail,
    GetResumeById,
    DeleteResumeById
}
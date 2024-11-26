import axios from 'axios';
const API_URL = import.meta.env.VITE_BACKEND_URL + '/api/v1/notifications/';

// API để lấy các notification chưa đọc từ DB
export const getUnreadNotifications = async (userId) => {
    try {
        console.log("getUnreadNotifications\t" + API_URL + `receiver/${userId}/unread`)
        const response = await axios.get(API_URL + `receiver/${userId}/unread`);
        console.log(response)

        return response.data.data;
    } catch (error) {
        console.error("Error loading unread notifications:", error);
        return [];
    }
};

// API để đánh dấu thông báo là đã đọc trong DB
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await axios.patch(API_URL + `read/${notificationId}`, {
            isRead: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return null;
    }
};

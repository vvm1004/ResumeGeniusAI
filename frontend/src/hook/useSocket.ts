import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;  // Thay đổi URL theo cấu hình server của bạn

export const useSocket = (userId: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [socketNotificationsData, setNotifications] = useState<string[]>([]);
    // console.log("userId", userId)
    useEffect(() => {
        // Tạo kết nối WebSocket
        const newSocket = io(SOCKET_URL, {
            query: { userId },  // Gửi userId khi kết nối
            withCredentials: true,
            transports: ['websocket'],  // Đảm bảo sử dụng WebSocket transport

        });
        setSocket(newSocket);

        // Lắng nghe sự kiện 'jobNotification' và cập nhật thông báo
        newSocket.on('jobNotification', (data: string) => {
            console.log("jobNotification\n", data)
            setNotifications((prevNotifications) => [...prevNotifications, data]);
        });

        // Dọn dẹp khi component bị unmount
        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    return { socket, socketNotificationsData };
};

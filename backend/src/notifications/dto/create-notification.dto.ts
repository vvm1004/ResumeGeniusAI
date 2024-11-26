export class CreateNotificationDto {
    message: string;
    contentId: string;  // ID của content liên quan (có thể là job, application, ... tùy theo yêu cầu)
    receiverId: string; // ID người nhận
    senderId: string;   // ID người gửi
    timestamp: Date;
    isRead?: boolean;   // Trạng thái thông báo đã đọc, mặc định là false nếu không có
}

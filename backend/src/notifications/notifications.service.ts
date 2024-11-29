import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification, NotificationDocument } from './schemas/notification.schema';


@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    ) { }

    async create(createNotificationDto: CreateNotificationDto) {
        // const createdNotification = new this.notificationModel(createNotificationDto);
        let newNoti = await this.notificationModel.create({
            ...createNotificationDto,
            createdBy: {
                _id: createNotificationDto.senderId,
                email: ""
            }
        })

        return newNoti;
    }

    async findAll() {
        return this.notificationModel.find().exec();
    }
    async findByReceiverId(receiverId: string) {
        return this.notificationModel.find({ receiverId }).exec();
    }
    // Lấy tất cả thông báo chưa đọc của receiverId
    async findUnreadByReceiverId(receiverId: string) {
        return this.notificationModel
            .find({ receiverId, isRead: false }) // Điều kiện tìm kiếm
            .exec();
    }

    // Cập nhật trạng thái isRead của một thông báo
    async markAsRead(notificationId: string) {
        return this.notificationModel
            .findByIdAndUpdate(notificationId, { isRead: true }, { new: true }) // Cập nhật và trả về thông báo mới
            .exec();
    }
}

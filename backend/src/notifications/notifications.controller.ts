import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/customize';
@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }
    @Public()
    @Get()
    findAll() {
        return this.notificationsService.findAll();
    }
    @Public()
    @Post()
    create(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationsService.create(createNotificationDto);
    }
    // Tìm thông báo theo receiverId
    @Public()
    @Get('receiver/:receiverId')
    findByReceiverId(@Param('receiverId') receiverId: string) {
        return this.notificationsService.findByReceiverId(receiverId);
    }
    @Public()
    @Get('receiver/:receiverId/unread')
    findUnreadByReceiverId(@Param('receiverId') receiverId: string) {
        return this.notificationsService.findUnreadByReceiverId(receiverId);
    }

    // Đánh dấu một thông báo là đã đọc
    @Public()
    @Patch('read/:notificationId')
    markAsRead(@Param('notificationId') notificationId: string) {
        return this.notificationsService.markAsRead(notificationId);
    }
}

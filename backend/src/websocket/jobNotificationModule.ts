// job-notification.module.ts
import { Module } from '@nestjs/common';
import { JobNotificationGateway } from './jobNotificationGateway';
import { JobNotificationService } from './jobNotificationService';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';
import { HttpModule } from '@nestjs/axios';
import { NotificationSchema, Notification } from 'src/notifications/schemas/notification.schema';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }],), HttpModule, MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),  // Import schema của Notification
    ],
    providers: [JobNotificationGateway, JobNotificationService, NotificationsService],
    exports: [JobNotificationGateway, JobNotificationService],  // Đảm bảo JobNotificationGateway được export
})
export class JobNotificationModule { }

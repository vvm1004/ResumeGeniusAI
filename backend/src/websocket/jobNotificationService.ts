// import { Injectable } from '@nestjs/common';
// import { JobNotificationGateway } from './JobNotificationGateway'

// @Injectable()
// export class JobNotificationService {
//   constructor(private readonly jobNotificationGateway: JobNotificationGateway) {}

//   // Gửi thông báo đến HR khi có ứng viên apply vào công việc của họ
//   sendJobApplicationNotification(userId: string, applicantName: string) {
//     const message = `Ứng viên ${applicantName} đã apply vào công việc ${userId}.`;
//     this.jobNotificationGateway.sendNotificationToHr(userId, message);
//   }

//   // Có thể tạo thêm các phương thức gửi thông báo khác tùy theo yêu cầu
// }
// job-notification.service.ts
import { Injectable } from '@nestjs/common';
import { JobNotificationGateway } from './jobNotificationGateway';  // Đảm bảo đường dẫn đúng
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';

@Injectable()
export class JobNotificationService {
  constructor(private readonly jobNotificationGateway: JobNotificationGateway, @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>) { }

  async sendJobApplicationNotification(jobId: string, userId: string) {
    const job = await this.jobModel.findById(jobId).exec();

    if (!job) {
      console.error(`Job with ID ${jobId} not found.`);
      return;
    }
    const hrId = job.createdBy._id.toString();  

    const message = `There is new candidate in ${job.name} !`;

    this.jobNotificationGateway.sendNotificationToHr(jobId,hrId, userId, message);
  }
}

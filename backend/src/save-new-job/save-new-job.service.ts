import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SavedJob } from './schemas/save-new-job.schema';
import { User } from 'src/users/schemas/user.schema';
import { Job } from 'src/jobs/schemas/job.schema';

@Injectable()
export class SavedJobService {
  constructor(
    @InjectModel(SavedJob.name) private readonly savedJobModel: Model<SavedJob>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
  ) {}

  // Phương thức để lưu công việc
  async saveJob(userId: string, jobId: string): Promise<SavedJob> {
    // Kiểm tra người dùng có tồn tại không
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra công việc có tồn tại không
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Kiểm tra công việc đã được lưu chưa
    const existingSavedJob = await this.savedJobModel.findOne({
      userId, // Sử dụng userId thay vì user
      jobId,  // Sử dụng jobId thay vì job
    });
    if (existingSavedJob) {
      throw new ForbiddenException('You have already saved this job');
    }

    // Lưu công việc mới vào cơ sở dữ liệu
    const savedJob = new this.savedJobModel({
      userId, // Sử dụng userId thay vì user
      jobId,  // Sử dụng jobId thay vì job
    });

    return savedJob.save();
  }

  // Phương thức để lấy các công việc đã lưu của người dùng
  async getSavedJobs(userId: string): Promise<SavedJob[]> {
    // Lấy tất cả các công việc đã lưu của người dùng
    return this.savedJobModel
      .find({ userId })  // Sử dụng userId thay vì user
      .populate('jobId'); // Tham chiếu đến công việc trong SavedJob
  }

  // Phương thức để xóa công việc đã lưu
  async removeSavedJob(userId: string, jobId: string): Promise<void> {
    const result = await this.savedJobModel.deleteOne({ userId, jobId }); // Sử dụng userId và jobId
    if (result.deletedCount === 0) {
      throw new NotFoundException('Saved job not found');
    }
  }
}

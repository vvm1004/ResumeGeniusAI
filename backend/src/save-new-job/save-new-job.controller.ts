import { Controller, Post, Param, Get, Delete, Body } from '@nestjs/common';
import { SavedJobService } from './save-new-job.service';
import { Public } from 'src/decorator/customize';

@Controller('saved-jobs')
export class SavedJobController {
  constructor(private readonly savedJobService: SavedJobService) {}

  // Lưu công việc đã lưu
  @Post(':jobId')
  @Public()
  async saveJob(
    @Param('jobId') jobId: string,   // Nhận jobId từ URL
    @Body('userId') userId: string,  // Nhận userId từ request body
  ) {
    // Lưu công việc cho người dùng
    return this.savedJobService.saveJob(userId, jobId);
  }

  // Lấy danh sách các công việc đã lưu của người dùng
  @Get(':userId')
  @Public()
  async getSavedJobs(@Param('userId') userId: string) {
    // Lấy các công việc đã lưu của người dùng
    return this.savedJobService.getSavedJobs(userId);
  }

  // Xóa công việc đã lưu của người dùng
  @Delete(':jobId')
  @Public()
  async removeSavedJob(
    @Param('jobId') jobId: string,   // Nhận jobId từ URL
    @Body('userId') userId: string,  // Nhận userId từ request body
  ) {
    // Xóa công việc đã lưu cho người dùng
    return this.savedJobService.removeSavedJob(userId, jobId);
  }
}

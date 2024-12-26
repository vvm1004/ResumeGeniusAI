import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { Resume, ResumeSchema } from './schemas/resume.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JobNotificationModule } from 'src/websocket/JobNotificationModule';
import { JobNotificationService } from 'src/websocket/jobNotificationService';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }])
    ,JobNotificationModule,HttpModule,
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])

  ],

  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule { }
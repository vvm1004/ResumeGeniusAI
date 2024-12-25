import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { Resume, ResumeSchema } from './schemas/resume.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JobNotificationModule } from 'src/websocket/JobNotificationModule';
import { JobNotificationService } from 'src/websocket/jobNotificationService';

@Module({
  imports: [MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),JobNotificationModule],

  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule { }
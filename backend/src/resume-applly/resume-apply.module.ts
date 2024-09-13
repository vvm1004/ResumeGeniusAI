import { Module } from '@nestjs/common';
import { ResumeService } from './resume-apply.service';
import { ResumeController } from './resume-apply.controller';
import { Resume, ResumeSchema } from './schemas/resume-apply.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }])],

  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule { }

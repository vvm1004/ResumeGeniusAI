import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schemas/job.schema';
import { HttpModule } from '@nestjs/axios';
import { ResumeRegistration, ResumeRegistrationSchema } from 'src/resume-registration/schemas/resume-registration.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }],), HttpModule,
    MongooseModule.forFeature([{ name: ResumeRegistration.name, schema: ResumeRegistrationSchema }])
  ],

  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule { }

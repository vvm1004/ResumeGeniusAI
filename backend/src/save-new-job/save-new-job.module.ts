import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavedJobController } from './save-new-job.controller';
import { SavedJobService } from './save-new-job.service';
import { SavedJob, SavedJobSchema } from './schemas/save-new-job.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavedJob.name, schema: SavedJobSchema },
      { name: User.name, schema: UserSchema },
      { name: Job.name, schema: JobSchema },
    ]),
  ],
  controllers: [SavedJobController],
  providers: [SavedJobService],
})
export class SavedJobModule {}

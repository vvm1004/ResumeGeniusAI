import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Job } from 'src/jobs/schemas/job.schema';

@Schema({ timestamps: true })
export class SavedJob extends Document {
  @Prop({ type: String, ref: 'User' })
  userId: string; // Lưu ID người dùng

  @Prop({ type: String, ref: 'Job' })
  jobId: string; // Lưu ID công việc

  @Prop({ default: Date.now })
  createdAt: Date; // Thời gian công việc được lưu
}

export const SavedJobSchema = SchemaFactory.createForClass(SavedJob);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ResumeRegistrationDocument = HydratedDocument<ResumeRegistration>;

@Schema({ timestamps: true })
export class ResumeRegistration {

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true, unique: false })
  email: string;

  @Prop({ required: true, unique: true })
  resumeId: string;

  @Prop({ required: false })
  resumeTitle: string;

  @Prop([{ title: String, value: String }])
  resumeSkill: Array<any>;


  //--------------------------------------------
  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ResumeRegistrationSchema = SchemaFactory.createForClass(ResumeRegistration);

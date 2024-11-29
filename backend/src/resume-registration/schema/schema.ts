import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class ResumeRegistration {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    id: mongoose.Types.ObjectId;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    userName: string;

    @Prop({ required: true, unique: false })
    email: string;

    @Prop({ required: true, unique: true })
    resumeId: string;

    @Prop({ required: true })
    resumeTitle: string;

    @Prop({ required: false })
    resumeSkill: string;

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

export type ResumeRegistrationDocument = HydratedDocument<ResumeRegistration>;

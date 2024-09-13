import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ResumeBuilderDocument = HydratedDocument<ResumeBuilder>

@Schema({ timestamps: true })
export class ResumeBuilder {
    @Prop({ required: true })
    title: string;

    @Prop()
    resumeId: string;

    @Prop()
    userEmail: string;

    @Prop()
    userName: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    jobTitle: string;

    @Prop()
    address: string;

    @Prop()
    phone: string;

    @Prop()
    email: string;

    @Prop()
    themeColor: string;

    @Prop()
    summery: string;

    @Prop([{ title: String, companyName: String, city: String, state: String, startDate: String, endDate: String, currentlyWorking: Boolean, workSummery: String }])
    experience: Array<any>;

    @Prop([{ universityName: String, startDate: String, endDate: String, degree: String, major: String, description: String }])
    education: Array<any>;

    @Prop([{ name: String, rating: Number }])
    skills: Array<any>;

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }
    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

}

export const ResumeBuilderSchema = SchemaFactory.createForClass(ResumeBuilder);
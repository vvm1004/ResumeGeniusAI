import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ResumeBuilderDocument = HydratedDocument<ResumeBuilder>;

@Schema({ timestamps: true })
export class ResumeBuilder {
  @Prop({ required: true })
  title: string;

  @Prop()
  imageResume: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Object, required: true })
  personalInformation: {
    name: string;
    email: string;
    address: string;
    phone: string;
    github?: string;
    linkedin?: string;
    socialLink?: string;
    image?: string;
  };

  @Prop()
  summary: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Template' })
  template: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Object })
  settings: {
    colors: {
      header: string[];
      footer: string[];
      text: string[];
      background: string[];
    };
    fonts: {
      primary: string[];
      secondary: string[];
    };
  };

  @Prop([
    {
      title: String,
      company: String,
      position: String,
      date: String,
      description: String,
      responsibilities: [String],
    },
  ])
  experience: Array<any>;

  @Prop([
    {
      degree: String,
      major: String,
      institution: String,
      gpa: String,
      date: String,
    },
  ])
  education: Array<any>;

  @Prop([
    {
      title: String,
      description: String,
      features: String,
      technologies: String,
      githubLink: String,
      demo: String,
      date: String,
      tool: String,
    },
  ])
  projects: Array<any>;

  @Prop([
    {
      title: String,
      organization: String,
      date: String,
      description: String,
      role: String,
      achievements: [String],
    },
  ])
  activities: Array<any>;

  @Prop([{ title: String, issuer: String, date: String, description: String }])
  awards: Array<any>;

  @Prop([{ title: String, value: String }])
  skills: Array<any>;

  @Prop([{ title: String, level: String }])
  languages: Array<any>;

  @Prop([{ title: String, description: String }])
  interests: Array<any>;

  @Prop([
    { name: String, position: String, organization: String, contact: String },
  ])
  references: Array<any>;

  @Prop([{ name: String, details: String, year: String, link: String }])
  certifications: Array<any>;

  @Prop([{ title: String, value: String, date: String }])
  customFields: Array<any>;

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

export const ResumeBuilderSchema = SchemaFactory.createForClass(ResumeBuilder);

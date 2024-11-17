import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
export type TemplateDocument = HydratedDocument<Template>;
@Schema({ timestamps: true })
export class Template{
  @Prop({ required: true })
  name: string; 

  @Prop({ required: true })
  description: string; 

  @Prop({ required: true })
  layout: string; 

  @Prop()
  previewImage: string;

  @Prop({ type: Object })
  settings: {
    colors: string[];
    fonts: string[];
  };

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

export const TemplateSchema = SchemaFactory.createForClass(Template);

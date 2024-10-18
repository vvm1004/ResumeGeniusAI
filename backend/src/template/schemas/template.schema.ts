import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type TemplateDocument = HydratedDocument<Template>;
@Schema({ timestamps: true })
export class Template{
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  preview: string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);

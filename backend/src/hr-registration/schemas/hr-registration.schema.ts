// src/hr-registration/schemas/hr-registration.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';

export type HrRegistrationDocument = HydratedDocument<HrRegistration>;

@Schema({ timestamps: true }) // Để tự động thêm createdAt và updatedAt
export class HrRegistration {
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  // userId: mongoose.Schema.Types.ObjectId; // ID của người dùng đăng ký HR
  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };
  @Prop({ required: true })
  email: string; // Email của HR đăng ký

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: false })
  phone?: string;

  @Prop({ required: false })
  address?: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: 'pending' | 'approved' | 'rejected'; // Trạng thái đăng ký HR

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

export const HrRegistrationSchema =
  SchemaFactory.createForClass(HrRegistration);

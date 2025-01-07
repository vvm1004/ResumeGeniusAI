// src/notifications/schemas/notification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
export type NotificationDocument = HydratedDocument<Notification>

@Schema({ timestamps: true })
export class Notification {

  @Prop()
  message: string;

  @Prop()
  contentId: mongoose.Schema.Types.ObjectId;

  @Prop()
  receiverId: mongoose.Schema.Types.ObjectId;

  @Prop()
  senderId: mongoose.Schema.Types.ObjectId;
  @Prop()
  link: string;

  @Prop()
  timestamp: Date;

  @Prop({ default: false })
  isRead: boolean;

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

export const NotificationSchema = SchemaFactory.createForClass(Notification);

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
    timestamp: Date;

    @Prop({ default: false })
    isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

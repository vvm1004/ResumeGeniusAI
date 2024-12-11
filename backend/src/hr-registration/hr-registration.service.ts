// src/hr-registration/hr-registration.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { HrRegistration, HrRegistrationDocument } from './schema/schema';

@Injectable()
export class HrRegistrationService {
    constructor(
        @InjectModel(HrRegistration.name) private readonly hrRegistrationModel: Model<HrRegistrationDocument>,
    ) { }

    // Tạo mới đăng ký HR
    async createRegistration(
        userId: string,
        company: string,
        email: string,
        fullName: string,
        phone: string,
        address: string
    ) {
        try {
            // Create a new registration document
            const newRegistration = new this.hrRegistrationModel({
                userId,
                company,
                email,
                fullName,
                phone,
                address,
                createdBy: { _id: userId, email: email },
                status: 'pending', // Default status is 'pending'
            });

            // Save the registration to the database
            await newRegistration.save();

            // Return a success response to the frontend
            return {
                success: true,
                message: 'Registration successful!',
                data: newRegistration, // Optionally, you can return the saved registration data if needed
            };
        } catch (error) {
            // Return an error response if something goes wrong
            console.error(error); // For debugging purposes
            return {
                success: false,
                message: 'An error occurred during registration. Please try again.',
            };
        }
    }


    // Lấy tất cả đăng ký HR
    async getAllRegistrations() {
        return this.hrRegistrationModel.find().exec();
    }

    // Lấy đăng ký theo userId
    async findByUserId(userId: string) {
        return this.hrRegistrationModel.findOne({ userId }).exec();
    }

    // Cập nhật trạng thái đăng ký HR
    async updateStatus(
        userId: string,
        status: 'approved' | 'rejected',
        updatedBy: { _id: mongoose.Schema.Types.ObjectId; email: string }
    ) {
        return this.hrRegistrationModel.findOneAndUpdate(
            { userId },
            { status, updatedBy },
            { new: true }
        ).exec();
    }

    // Xóa một đăng ký HR (soft delete)
    async deleteRegistration(
        userId: string,
        deletedBy: { _id: mongoose.Schema.Types.ObjectId; email: string }
    ) {
        return this.hrRegistrationModel.findOneAndUpdate(
            { userId },
            { deletedBy },
            { new: true }
        ).exec();
    }
}

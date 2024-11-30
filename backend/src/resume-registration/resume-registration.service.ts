import { Injectable } from '@nestjs/common';
import { ResumeRegistration, ResumeRegistrationDocument } from './schemas/resume-registration.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ResumeRegistrationService {

    constructor(
        @InjectModel(ResumeRegistration.name) private resumeModel: Model<ResumeRegistrationDocument>,
    ) { }

    // Phương thức tạo một Resume mới
    async create(createResumeDto: any) {
        //const newResume = new this.resumeModel(createResumeDto);

        let newResume = await this.resumeModel.create({
            ...createResumeDto,
            createdBy: {
                _id: createResumeDto.userId,
                email: createResumeDto.email
            }
        })
        return newResume.save();
    }

    // Phương thức tìm kiếm Resume theo userId
    async findAllByUserId(userId: string) {
        return this.resumeModel.find({ userId }).exec();
    }

    // Phương thức tìm một Resume theo email
    async findByEmail(email: string) {
        return this.resumeModel.findOne({ email }).exec();
    }
    async deleteByResumeId(resumeId: string) {
        const result = await this.resumeModel.findOneAndDelete({ resumeId }).exec();
        return result;
    }
}
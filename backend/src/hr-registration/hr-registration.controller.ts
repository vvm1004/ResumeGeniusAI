// src/hr-registration/hr-registration.controller.ts
import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { HrRegistrationService } from './hr-registration.service';
import { HrRegistration } from './schema/schema';
import { ObjectId } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Public, SkipCheckPermission } from 'src/decorator/customize';
@ApiTags('hr-registration')
@Controller('hr-registration')
export class HrRegistrationController {
    constructor(private readonly hrRegistrationService: HrRegistrationService) { }

    // Tạo mới đăng ký HR
    @Post()
    @SkipCheckPermission()
    @Public()
    async createRegistration(
        @Body() body: {
            userId: string;
            company: string;
            email: string;
            fullName: string;
            phone?: string;
            address?: string;
        }
    ) {
        return this.hrRegistrationService.createRegistration(
            body.userId,
            body.company,
            body.email,
            body.fullName,
            body.phone,
            body.address
            
        );
    }

    // Lấy tất cả đăng ký HR
    @Get()
    async getAllRegistrations() {
        return this.hrRegistrationService.getAllRegistrations();
    }

    // Lấy đăng ký HR theo userId
    @Get(':userId')
    async getRegistrationByUserId(@Param('userId') userId: string) {
        return this.hrRegistrationService.findByUserId(userId);
    }

    // Cập nhật trạng thái đăng ký HR
    @Patch(':userId')
    async updateStatus(
        @Param('userId') userId: string,
        @Body() body: { status: 'approved' | 'rejected'; updatedBy: { _id: ObjectId; email: string } }
    ) {
        return this.hrRegistrationService.updateStatus(userId, body.status, body.updatedBy);
    }

    // Xóa đăng ký HR (soft delete)
    @Delete(':userId')
    async deleteRegistration(
        @Param('userId') userId: string,
        @Body() body: { deletedBy: { _id: ObjectId; email: string } }
    ) {
        return this.hrRegistrationService.deleteRegistration(userId, body.deletedBy);
    }
}

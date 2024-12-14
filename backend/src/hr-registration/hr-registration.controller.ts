// src/hr-registration/hr-registration.controller.ts
import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { HrRegistrationService } from './hr-registration.service';
import { HrRegistration } from './schema/schema';
import { ObjectId } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Public, SkipCheckPermission, User } from 'src/decorator/customize';
import aqp from 'api-query-params';
import { IUser } from 'src/users/users.interface';
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
    @Get('admin')
    @Public()
    // Lấy tất cả đăng ký HR
    async getAllRegistrations(
        @Query("current") currentPage: string,
        @Query("pageSize") limit: string,
        @Query() qs: string                       // Dùng AQP để xử lý các tham số tìm kiếm, lọc, v.v.
    ) {
        const queryParams = aqp(qs);  // Xử lý các tham số truy vấn

        // Truyền phân trang và các tham số lọc/sắp xếp vào service
        return this.hrRegistrationService.getAllRegistrations(+currentPage, +limit, qs);
    }

    // Lấy đăng ký HR theo userId
    @Get(':userId')
    async getRegistrationByUserId(@Param('userId') userId: string) {
        return this.hrRegistrationService.findByUserId(userId);
    }

    // Cập nhật trạng thái đăng ký HR
    @Patch(':id')
    async updateStatus(
        @Param('id') id: string,
        @Body() body: { status: 'approved' | 'rejected'; },
        @User() user: IUser
    ) {
        return this.hrRegistrationService.updateStatus(id, body.status, user);
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

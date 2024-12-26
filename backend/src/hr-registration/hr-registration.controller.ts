import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { HrRegistrationService } from './hr-registration.service';
import { HrRegistration } from './schemas/hr-registration.schema';
import { CreateHrRegisDto } from './dto/create-hr-registration.dto';
import { UpdateHrRegisDto } from './dto/update-hr-registration.dto';
import { ObjectId } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Public, SkipCheckPermission, User } from 'src/decorator/customize';
import aqp from 'api-query-params';
import { IUser } from 'src/users/users.interface';
@ApiTags('hr-registration')
@Controller('hr-registration')
export class HrRegistrationController {
  constructor(private readonly hrRegistrationService: HrRegistrationService) {}

  // Tạo mới đăng ký HR
  @Public()
  @SkipCheckPermission()
  @Post()
  async createRegistration(
    @Body() createHrRegisDto: CreateHrRegisDto,
    @User() user: IUser,
  ) {
    // console.log(createHrRegisDto, '\n\n', user, '\n');
    return this.hrRegistrationService.create(createHrRegisDto, user);
  }

  @Get('admin')
  // @Public()
  async getAllRegistrations(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string, // Dùng AQP để xử lý các tham số tìm kiếm, lọc, v.v.
  ) {
    const queryParams = aqp(qs); // Xử lý các tham số truy vấn
    console.log('getAllRegistrations', currentPage, '\t', limit);
    // Truyền phân trang và các tham số lọc/sắp xếp vào service
    return this.hrRegistrationService.getAllRegistrations(
      +currentPage,
      +limit,
      qs,
    );
  }

  // Lấy đăng ký HR theo userId
  @Get(':id')
  async getRegistrationByUserId(@Param('id') id: string) {
    return this.hrRegistrationService.findByUserId(id);
  }

  // Cập nhật trạng thái đăng ký HR
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHrRegisDto: UpdateHrRegisDto,
    @User() user: IUser,
  ) {
    return this.hrRegistrationService.update(id, updateHrRegisDto, user);
  }

  // Xóa đăng ký HR (soft delete)
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.hrRegistrationService.remove(id, user);
  }
}

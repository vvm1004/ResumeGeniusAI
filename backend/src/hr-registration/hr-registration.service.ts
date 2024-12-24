import { UsersService } from './../users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { CreateHrRegisDto } from './dto/create-hr-registration.dto';
import { UpdateHrRegisDto } from './dto/update-hr-registration.dto';
import {
  HrRegistration,
  HrRegistrationDocument,
} from './schemas/hr-registration.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class HrRegistrationService {
  constructor(
    @InjectModel(HrRegistration.name)
    private readonly hrRegistrationModel: SoftDeleteModel<HrRegistrationDocument>,
    private readonly usersService: UsersService,
    private readonly mailerService: MailService
  ) { }

  async create(createHrRegisDto: CreateHrRegisDto, user: IUser) {
    const { email } = createHrRegisDto;

    // Kiểm tra nếu email đã tồn tại trong hệ thống đăng ký HR
    const isExist = await this.hrRegistrationModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(
        'HR registration with this email already exists',
      );
    }

    // Tạo bản ghi mới trong HR Registration
    const newHrRegis = await this.hrRegistrationModel.create({
      ...createHrRegisDto,
      createdBy: {
        _id: null,
        email: null,
      },
    });
    console.log(newHrRegis)

    return {
      success: true,
      message: 'Registration successful!',
      data: newHrRegis,
    };
  }
  // Lấy tất cả đăng ký HR với phân trang và filter
  async getAllRegistrations(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;

    // Tính tổng số bản ghi và phân trang
    const totalItems = await this.hrRegistrationModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    console.log("\ntotalPages", totalPages, "\t", totalItems)
    console.log("\nfilter", filter)

    const result = await this.hrRegistrationModel
      .find()
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    console.log("\nresult: ", result)
    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  // Lấy đăng ký HR theo ID user
  async findByUserId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const registration = await this.hrRegistrationModel.findOne({ id });
    if (!registration) {
      throw new BadRequestException('HR registration not found');
    }

    return registration;
  }
  private generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // Cập nhật đăng ký HR
  async update(id: string, updateHrRegisDto: UpdateHrRegisDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid HR registration ID');
    }

    // Kiểm tra bản ghi cần cập nhật
    const existingRegistration = await this.hrRegistrationModel.findById(id);
    if (!existingRegistration) {
      throw new BadRequestException('HR registration not found');
    }

    // Cập nhật thông tin HR registration
    const updateResult = await this.hrRegistrationModel.updateOne(
      { _id: id },
      {
        ...updateHrRegisDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    // Xử lý theo trạng thái
    if (updateHrRegisDto.status === 'approved') {
      const existingUser = await this.usersService.findOneByUsername(
        updateHrRegisDto.email,
      );
      if (existingUser) {
        throw new BadRequestException(
          `User with email ${updateHrRegisDto.email} already exists.`,
        );
      }

      // Tạo tài khoản mới cho HR
      const roleid = '670f7904f261c5eb15016692';
      const pass = this.generateRandomString(6);
      const newUser = await this.usersService.create(
        {
          name: updateHrRegisDto.fullName,
          email: updateHrRegisDto.email,
          password: pass,
          age: updateHrRegisDto.age,
          gender: updateHrRegisDto.gender,
          address: updateHrRegisDto.address,
          role: new mongoose.Types.ObjectId(roleid) as any,
          company: updateHrRegisDto.company,
        },
        user,
      );
      // Gửi email thông tin tài khoản HR
      await this.mailerService.sendHrAccountEmail(updateHrRegisDto.email, {
        email: updateHrRegisDto.email,
        password: pass,
        fullName: newUser.name,
      });

      return {
        updateResult,
        newUser,
      };
    }

    return updateResult;
  }

  // Xóa đăng ký HR (soft delete)
  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid HR registration ID');
    }

    const existingRegistration = await this.hrRegistrationModel.findById(id);
    if (!existingRegistration) {
      throw new BadRequestException('HR registration not found');
    }

    await this.hrRegistrationModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return this.hrRegistrationModel.softDelete({ _id: id });
  }



}

import { UsersService } from './../users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { CreateHrRegisDto } from './dto/create-hr-registration.dto';
import { UpdateHrRegisDto } from './dto/update-hr-registration.dto';
import { ADMIN_ROLE } from 'src/databases/sample';
import {
  HrRegistration,
  HrRegistrationDocument,
} from './schemas/hr-registration.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
// import * as generator from 'secure-random-password';
@Injectable()
export class HrRegistrationService {
  constructor(
    @InjectModel(HrRegistration.name)
    private hrRegistrationModel: SoftDeleteModel<HrRegistrationDocument>,
    private readonly usersService: UsersService,
  ) {}

  // Tạo mới đăng ký HR
  async create(CreateHrRegisDto: CreateHrRegisDto, user: IUser) {
    try {
      const { company, email, fullName, phone, address, age, gender, status } =
        CreateHrRegisDto;
      const isExist = await this.hrRegistrationModel.findOne({ email });
      if (isExist) {
        throw new BadRequestException(`Đăng ký HR với email đã tồn tại`);
      }
      const newHrRegis = await this.hrRegistrationModel.create({
        company,
        email,
        fullName,
        phone,
        address,
        age,
        gender,
        status,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });
      return {
        success: true,
        message: 'Registration successful!',
        data: newHrRegis, // Optionally, you can return the saved registration data if needed
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
  // async getAllRegistrations() {
  //     return this.hrRegistrationModel.find().exec();
  // }

  async getAllRegistrations(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    const totalItems = (await this.hrRegistrationModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.hrRegistrationModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }
  // Lấy đăng ký theo userId
  async findByUserId(id: string) {
    return this.hrRegistrationModel.findOne({ id }).exec();
  }

  async update(id: string, updateHrRegisDto: UpdateHrRegisDto, user: IUser) {
    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found Hr Registration with id ${id}`);
    }

    const { company, email, fullName, phone, address, age, gender, status } =
      updateHrRegisDto;

    // Cập nhật HR Registration
    const updateResult = await this.hrRegistrationModel.updateOne(
      { _id: id },
      {
        company,
        email,
        fullName,
        phone,
        address,
        age,
        gender,
        status,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    if (status === 'approved') {
      const existingUser = await this.usersService.findOneByUsername(email);
      if (existingUser) {
        throw new BadRequestException(
          `User with email ${email} already exists.`,
        );
      }

      // // Tạo mật khẩu ngẫu nhiên
      // const password = generator.generate({
      //   length: 8,
      //   numbers: true,
      //   symbols: true,
      //   uppercase: true,
      //   lowercase: true,
      //   excludeSimilarCharacters: true,
      // });
      const roleid = '670f7904f261c5eb15016692';
      const passTemp = '123456';
      // Tạo người dùng mới
      const newUser = await this.usersService.create(
        {
          name: fullName,
          email: email,
          password: passTemp,
          // password:password,
          age: age,
          gender: gender,
          address: address,
          role: new mongoose.Types.ObjectId(roleid),
          company: company,
        },
        user,
      );

      return {
        updateResult,
        newUser,
      };
    }

    return updateResult;
  }

  // Xóa một đăng ký HR (soft delete)
  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Not found Hr Registr with id ${id}`);
    await this.hrRegistrationModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.hrRegistrationModel.softDelete({
      _id: id,
    });
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';


@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) { }

  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    if(createCompanyDto.minScale >= createCompanyDto.maxScale){
      throw new BadRequestException('minScale must be less than maxScale');
    }
    return this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }

    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (currentPage - 1) * (limit);
    let defaultLimit = limit ? limit : 10;

    const totalItems = (await this.companyModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.companyModel.find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .populate(population)
      .exec()

    return {
      meta: {
        current: currentPage, //trang hien tai
        pageSize: limit,  //so luong ban ghi da lay
        pages: totalPages, //tong so trang voi dieu kien query
        total: totalItems //tong so phan tu (so ban ghi)
      },
      result //kết quả query
    }

  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return `Not found company with id ${id}`
    return this.companyModel.findById(id)
  }


  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    if(updateCompanyDto.minScale >= updateCompanyDto.maxScale){
      throw new BadRequestException('minScale must be less than maxScale');
    }
    return await this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
  }

  async remove(id: string, user: IUser) {
    await this.companyModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.companyModel.softDelete({
      _id: id,
    })
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>, private readonly httpService: HttpService) { }

  async create(createJobDto: CreateJobDto, user: IUser) {
    let newJob = await this.jobModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    // const response = await firstValueFrom(
    //   this.httpService.post(
    //     `http://localhost:8000/api/v1/jobs/send-job/${newJob.id}`,
    //   ),
    // );
    return {
      _id: newJob?._id,
      createdAt: newJob?.createdAt
    }
  }

  async findAll(currentPage: number, limit: number, qs: string, user: IUser) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    if(user.company && user.company.name ){
      filter['company.name'] = user.company.name
    }
    console.log(user.company.name)
    console.log(filter)
    let offset = (currentPage - 1) * (limit);
    let defaultLimit = limit ? limit : 10;

    const totalItems = (await this.jobModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit);
   

    const result = await this.jobModel.find(filter)
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
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("Not found job with id: " + id)
    return this.jobModel.findById(id)
  }

  async update(_id: string, updateJobDto: UpdateJobDto, user: IUser) {
    const updated = await this.jobModel.updateOne(
      { _id },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return updated
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `Not found job`
    }
    await this.jobModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.jobModel.softDelete({
      _id: id,
    })
  }
}

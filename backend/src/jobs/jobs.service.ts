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
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    if (filter.salary) {
      const salaryFilter = filter.salary;
      delete filter.salary;

      if (salaryFilter === "below10") {
        filter.salary = { $lt: 10000000 }; // Lương dưới 10 triệu
      } else if (salaryFilter === "10-15") {
        filter.salary = { $gte: 10000000, $lte: 15000000 }; // Lương từ 10 triệu đến 15 triệu
      } else if (salaryFilter === "15-20") {
        filter.salary = { $gte: 15000000, $lte: 20000000 }; // Lương từ 15 triệu đến 20 triệu
      } else if (salaryFilter === "20-30") {
        filter.salary = { $gte: 20000000, $lte: 30000000 }; // Lương từ 20 triệu đến 30 triệu
      } else if (salaryFilter === "above30") {
        filter.salary = { $gt: 30000000 }; // Lương trên 30 triệu
      }
    }

    delete filter.current;
    delete filter.pageSize;
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

  async findAllWithAdminPage(currentPage: number, limit: number, qs: string, user: IUser) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    if (user.company && user.company.name) {
      filter['company.name'] = user.company.name
    }

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
  async findMatchingJobs(): Promise<Job[]> {
    const jobs = await this.jobModel.aggregate([
      {
        $lookup: {
          from: 'resumeregistrations', // Tên collection của ResumeRegistration trong MongoDB
          localField: 'skills', // Trường skills trong Job
          foreignField: 'resumeSkill', // Trường resumeSkill trong ResumeRegistration
          as: 'matchedResumes', // Kết quả nối sẽ được lưu vào mảng matchedResumes
        },
      },
      {
        $match: {
          'matchedResumes.resumeTitle': { $exists: true }, // Lọc các công việc có resumeTitle
        },
      },
      {
        $project: {
          name: 1,
          skills: 1,
          company: 1,
          location: 1,
          salary: 1,
          quantity: 1,
          level: 1,
          description: 1,
          startDate: 1,
          endDate: 1,
          isActive: 1,
          updatedBy: 1,
          createdBy: 1,
          deletedBy: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return jobs;
  }
}
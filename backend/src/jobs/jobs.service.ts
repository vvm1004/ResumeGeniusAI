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
import { ResumeRegistration, ResumeRegistrationDocument } from 'src/resume-registration/schemas/resume-registration.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>, private readonly httpService: HttpService,
    @InjectModel(ResumeRegistration.name) private resumeRegistrationModel: SoftDeleteModel<ResumeRegistrationDocument>,

  ) { }

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
        filter.salary = { $lt: 10000000 }; 
      } else if (salaryFilter === "10-15") {
        filter.salary = { $gte: 10000000, $lte: 15000000 }; 
      } else if (salaryFilter === "15-20") {
        filter.salary = { $gte: 15000000, $lte: 20000000 }; 
      } else if (salaryFilter === "20-30") {
        filter.salary = { $gte: 20000000, $lte: 30000000 }; 
      } else if (salaryFilter === "above30") {
        filter.salary = { $gt: 30000000 }; 
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
    if (user.company && user.company._id) {
      filter['company._id'] = user.company._id
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
      throw new BadRequestException("Not found jobb with id: " + id)
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
  async getJobCount(): Promise<number> {
    try {

      const count = await this.jobModel.countDocuments();
      return count;  // Trả về số lượng công việc
    } catch (error) {
      throw new Error('Failed to count jobs: ' + error.message);
    }

  }
  async findMatchingJobsByUserId(userId: string) {
    // Lấy danh sách resume từ userId
    const resumes = await this.resumeRegistrationModel.find({ userId });
  
    let matchingJobs = [];
  
    if (resumes && resumes.length > 0) {
      // Tạo tập hợp tất cả kỹ năng và tiêu đề từ ResumeRegistration
      const skillValues = new Set<string>();
      const keywordRegexes = new Set<RegExp>();
      
      resumes.forEach((resume) => {
        // Thêm các kỹ năng vào tập hợp
        resume.resumeSkill.forEach((skill) => skillValues.add(skill.value));
  
        // Tách title thành các từ khóa (bỏ qua dấu câu, phân biệt theo khoảng trắng)
        const keywords = resume.resumeTitle.split(/\s+/).map((word) => word.replace(/[^\w]/g, ''));
        keywords.forEach((keyword) => {
          if (keyword.length > 2) { // Loại bỏ từ khóa ngắn (dưới 3 ký tự)
            keywordRegexes.add(new RegExp(keyword, 'i'));
          }
        });
      });
  
      // Tạo regex từ skills
      const skillRegexes = Array.from(skillValues).map((skill) => new RegExp(skill, 'i'));
  
      // Tìm các công việc khớp với kỹ năng hoặc từ khóa từ title
      matchingJobs = await this.jobModel.find({
        $or: [
          { skills: { $in: skillRegexes } }, // Lọc theo kỹ năng (không phân biệt hoa thường)
          { name: { $in: Array.from(keywordRegexes) } }, // Lọc theo từ khóa từ name
        ],
      }).limit(4); // Giới hạn tối đa 4 công việc matching
    }
  
    const matchingJobCount = matchingJobs.length;
  
    // Nếu số lượng matchingJobs nhỏ hơn 4, bổ sung các job ngẫu nhiên
    if (matchingJobCount < 4) {
      const randomJobs = await this.jobModel.aggregate([
        { $match: { _id: { $nin: matchingJobs.map((job) => job._id) } } }, // Loại bỏ các job đã matching
        { $sample: { size: 4 - matchingJobCount } }, // Lấy thêm công việc ngẫu nhiên để tổng là 4
      ]);
  
      return [...matchingJobs, ...randomJobs]; // Ghép danh sách matching jobs và random jobs
    }
  
    // Nếu không có resume nào, trả về các job ngẫu nhiên
    if (resumes.length === 0) {
      return await this.jobModel.aggregate([
        { $sample: { size: 4 } }, // Lấy 4 công việc ngẫu nhiên
      ]);
    }
  
    return matchingJobs; // Trả về danh sách matching nếu đủ 4 job
  }
  
  async getJobLevelsCount(): Promise<{ type: string, value: number }[]> {
    const jobLevelsCount = await this.jobModel.aggregate([
      {
        $group: {
          _id: "$level",  // Group by job level
          count: { $sum: 1 },  // Count the number of jobs in each level
        },
      },
      {
        $project: {
          type: "$_id",  // Rename _id to type
          value: "$count",  // Rename count to value
          _id: 0,  // Remove _id from the result
        },
      },
      {
        $sort: { value: -1 },  // Optional: sort by value in descending order
      },
    ]);

    return jobLevelsCount;
  }

  async getTopCompanies(): Promise<{ company: string, jobs: number }[]> {
    const topCompanies = await this.jobModel.aggregate([
      {
        $group: {
          _id: '$company.name',  // Group by company name
          jobs: { $sum: 1 },  // Count the number of jobs for each company
        },
      },
      {
        $sort: { jobs: -1 },  // Sort by job count in descending order
      },
      {
        $limit: 5,  // Limit to top 5 companies
      },
      {
        $project: {
          company: '$_id',  // Rename _id to company
          jobs: 1,  // Keep the jobs field
          _id: 0,  // Remove _id field
        },
      },
    ]);

    return topCompanies;
  }
}
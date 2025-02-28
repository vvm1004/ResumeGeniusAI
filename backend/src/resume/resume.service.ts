import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import { JobNotificationGateway } from 'src/websocket/jobNotificationGateway';
import { JobNotificationService } from 'src/websocket/jobNotificationService';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
    private readonly jobNotificationService: JobNotificationService,
  ) { }

  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    const { url, typeUrl, companyId, jobId } = createUserCvDto;
    let newResume = await this.resumeModel.create({
      url,
      typeUrl,
      companyId,
      jobId,
      email: user.email,
      userId: user._id,
      status: 'PENDING',
      history: [
        {
          status: 'PENDING',
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      ],
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    const jobIdString: string = jobId.toString(); // Chuyển ObjectId thành string

    this.jobNotificationService.sendJobApplicationNotification(
      jobIdString,
      user._id,
    );

    return {
      _id: newResume?._id,
      createdAt: newResume?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hien tai
        pageSize: limit, //so luong ban ghi da lay
        pages: totalPages, //tong so trang voi dieu kien query
        total: totalItems, //tong so phan tu (so ban ghi)
      },
      result, //kết quả query
    };
  }

  async findAllWithAdminPage(currentPage: number, limit: number, qs: string, user: IUser) {
    const { filter, sort, projection, population } = aqp(qs);  // Parse query string
    delete filter.current;
    delete filter.pageSize;

    console.log(filter['jobId']);  // Log to see the filter for jobId

    if (user.company && user.company._id) {
      filter['companyId'] = user.company._id;
    }

    if (filter['jobId']) {
      const jobName = filter['jobId'];

      const jobs = await this.jobModel.find({ name: { $regex: jobName, $options: 'i' } }).exec();

      const jobIds = jobs.map(job => job._id);

      if (jobIds.length > 0) {
        filter['jobId'] = { $in: jobIds };
      } else {
        filter['jobId'] = { $in: [] };
      }
    }

    // Pagination logic
    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    // Get the total count of resumes based on the current filter
    const totalItems = await this.resumeModel.countDocuments(filter).exec();
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // Fetch the results with the current filter and pagination
    const result = await this.resumeModel.find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, // current page number
        pageSize: limit,      // number of items per page
        pages: totalPages,    // total number of pages
        total: totalItems     // total number of items (resumes)
      },
      result // the actual resumes data
    };
  }


  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Not found resume');
    return this.resumeModel.findById(id);
  }

  async findByUsers(user: IUser) {
    return this.resumeModel
      .find({ userId: user._id })
      .sort('-createdAt')
      .populate([
        {
          path: 'companyId',
          select: { name: 1 },
        },
        {
          path: 'jobId',
          select: { name: 1 },
        },
      ]);
  }

  async update(_id: string, status: string, jobId: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Not found resume');
    }
    const updated = await this.resumeModel.updateOne(
      { _id },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: [
            {
              status: status,
              updatedAt: new Date(),
              updatedBy: {
                _id: user._id,
                email: user.email,
              },
            },
          ],
        },
      },
    );

    const reciver= await this.resumeModel.findById(_id);
    this.jobNotificationService.sendJobStatusNotification(
      jobId,
      user._id,
      reciver.createdBy._id.toString(),
      status
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `Not found resume`;
    }
    await this.resumeModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.resumeModel.softDelete({
      _id: id,
    });
  }
}
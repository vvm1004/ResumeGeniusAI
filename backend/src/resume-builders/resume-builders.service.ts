import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeBuilderDto } from './dto/create-resume-builder.dto';
import { UpdateResumeBuilderDto } from './dto/update-resume-builder.dto';
import {
  ResumeBuilder,
  ResumeBuilderDocument,
} from './schemas/resume-builder.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class ResumeBuildersService {
  constructor(
    @InjectModel(ResumeBuilder.name)
    private resumeBuidlerModel: SoftDeleteModel<ResumeBuilderDocument>,
  ) {}

  async create(createResumeBuilderDto, user: IUser) {
    let newResumeBuilder = await this.resumeBuidlerModel.create({
      ...createResumeBuilderDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newResumeBuilder;
  }

  async update(_id: string, updateResumeBuilderDto, user: IUser) {
    const updated = await this.resumeBuidlerModel.updateOne(
      { _id },
      {
        ...updateResumeBuilderDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found resumeBuilder`);
    }
    await this.resumeBuidlerModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.resumeBuidlerModel.softDelete({ _id: id });
  }
  async findByUserId(
    userId: string,
    currentPage: number,
    limit: number,
    qs: string,
  ) {
    const { filter, sort, projection, population } = aqp(qs);

    // Remove pagination parameters from filter
    delete filter.current;
    delete filter.pageSize;

    // Add userId to the filter
    filter.user = userId; // Assuming your schema has a field 'user' to represent the user ID

    let offset = (currentPage - 1) * (limit || 10); // Default to 10 if limit is not provided
    const totalItems = await this.resumeBuidlerModel.countDocuments(filter); // Use countDocuments for accuracy
    const totalPages = Math.ceil(totalItems / limit);

    const result = await this.resumeBuidlerModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .populate(population)
      .populate('template')
      .select(projection as any)
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

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    const totalItems = (await this.resumeBuidlerModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeBuidlerModel
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Not found resumeBuilder with id: ' + id);
    return this.resumeBuidlerModel
      .findById(id)
      .populate('template', 'name preview');
  }
  async getResumeCountByDate(startDate: string, endDate: string) {
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1, // Sort by year in ascending order
          '_id.month': 1, // Sort by month in ascending order
          '_id.day': 1, // Sort by day in ascending order
        } as Record<string, 1 | -1>, // Explicitly cast to Record<string, 1 | -1>
      },
    ];

    return await this.resumeBuidlerModel.aggregate(pipeline);
  }
  async getRandomResume() {
    const count = await this.resumeBuidlerModel.countDocuments();
    if (count === 0) {
      throw new BadRequestException('No resumes available');
    }
    const randomIndex = Math.floor(Math.random() * count);
    const randomResume = await this.resumeBuidlerModel.findOne().skip(randomIndex);
    return this.generateResumeText(randomResume);
  }


  generateResumeText(resume) {
    if (!resume) return "No resume data provided.";

    const {
      personalInformation,
      experience,
      education,
      projects,
      activities,
      awards,
      skills,
      languages,
      certifications,
    } = resume;

    const sections = [];

    if (personalInformation?.address) {
      sections.push(`Address: ${personalInformation.address}`);
    }

    if (experience?.length) {
      const experienceText = experience
        .map((exp) => {
          const expDetails = [];
          if (exp.title) expDetails.push(`Title: ${exp.title}`);
          if (exp.position) expDetails.push(`Position: ${exp.position}`);
          if (exp.description) expDetails.push(`Description: ${exp.description}`);
          return `,${expDetails.join(" ")}`;
        })
        .join(" ");
      sections.push(`Experience:${experienceText}`);
    }

    if (education?.length) {
      const educationText = education
        .map((edu) => {
          const eduDetails = [];
          if (edu.degree) eduDetails.push(`Degree: ${edu.degree}`);
          if (edu.major) eduDetails.push(`Major: ${edu.major}`);
          if (edu.institution) eduDetails.push(`Institution: ${edu.institution}`);
          return `,${eduDetails.join("  ")}`;
        })
        .join(" ");
      sections.push(`Education:${educationText}`);
    }

    if (projects?.length) {
      const projectsText = projects
        .map((proj) => {
          const projDetails = [];
          if (proj.title) projDetails.push(`Title: ${proj.title}`);
          if (proj.technologies) projDetails.push(`Technologies: ${proj.technologies}`);
          if (proj.tool) projDetails.push(`Tool: ${proj.tool}`);
          return `,${projDetails.join("  ")}`;
        })
        .join(" ");
      sections.push(`Projects:${projectsText}`);
    }

    if (activities?.length) {
      const activitiesText = activities
        .map((act) => `,Title: ${act.title}`)
        .join(" ");
      sections.push(`Activities:${activitiesText}`);
    }

    if (awards?.length) {
      const awardsText = awards
        .map((award) => `,Title: ${award.title}`)
        .join(" ");
      sections.push(`Awards:${awardsText}`);
    }

    if (skills?.length) {
      const skillsText = skills
        .map((skill) => `,${skill.value}`)
        .join(" ");
      sections.push(`Skills:${skillsText}`);
    }

    if (languages?.length) {
      const languagesText = languages
        .map((lang) => `,${lang.title}`)
        .join(" ");
      sections.push(`Languages:${languagesText}`);
    }

    if (certifications?.length) {
      const certificationsText = certifications
        .map((cert) => `,Name: ${cert.name}`)
        .join("");
      sections.push(`Certifications:${certificationsText}`);
    }

    return sections.join(" ");
  }
}

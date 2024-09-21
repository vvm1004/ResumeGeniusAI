import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeBuilderDto } from './dto/create-resume-builder.dto';
import { UpdateResumeBuilderDto } from './dto/update-resume-builder.dto';
import { ResumeBuilder, ResumeBuilderDocument } from './schemas/resume-builder.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';

@Injectable()
export class ResumeBuildersService {
  constructor(@InjectModel(ResumeBuilder.name) private resumeBuidlerModel: SoftDeleteModel<ResumeBuilderDocument>) { }

  async create(createResumeBuilderDto) {
    let newResumeBuilder = await this.resumeBuidlerModel.create({
      ...createResumeBuilderDto
    })

    return newResumeBuilder
  }

  findAllByUserEmail(userEmail: string) {
    return this.resumeBuidlerModel.find({ userEmail }).exec();

  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("Not found resumeBuilder with id: " + id)
    return this.resumeBuidlerModel.findById(id)
  }

  async update(_id: string, updateJobDto) {
    const updated = await this.resumeBuidlerModel.updateOne(
      { _id },
      {
        ...updateJobDto
      })
    return updated
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `Not found resumeBuilder`
    }
    return this.resumeBuidlerModel.softDelete({
      _id: id,
    })
  }
}
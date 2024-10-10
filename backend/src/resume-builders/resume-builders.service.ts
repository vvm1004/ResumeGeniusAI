import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeBuilderDto } from './dto/create-resume-builder.dto';
import { UpdateResumeBuilderDto } from './dto/update-resume-builder.dto';
import { ResumeBuilder, ResumeBuilderDocument } from './schemas/resume-builder.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class ResumeBuildersService {
  constructor(@InjectModel(ResumeBuilder.name) private resumeBuidlerModel: SoftDeleteModel<ResumeBuilderDocument>) { }

  async create(createResumeBuilderDto, user: IUser) {
    let newResumeBuilder = await this.resumeBuidlerModel.create({
      ...createResumeBuilderDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
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
          email: user.email
        }
      }
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `Not found resumeBuilder`;
    }
    await this.resumeBuidlerModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return this.resumeBuidlerModel.softDelete({ _id: id });
  }

  findByUserId(userId: string) {
    return this.resumeBuidlerModel.find({ user: userId }).exec();

  }

  findAll() {
    return this.resumeBuidlerModel.find().exec();

  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("Not found resumeBuilder with id: " + id)
    return this.resumeBuidlerModel.findById(id)
  }

}
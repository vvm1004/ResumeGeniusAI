import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Template, TemplateDocument } from './schemas/template.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class TemplateService {
    constructor(@InjectModel(Template.name) private templateModel: SoftDeleteModel<TemplateDocument>) { }

    async create(createTemplateDtoo, user: IUser) {
        let newTemplate = await this.templateModel.create({
          ...createTemplateDtoo,
          createdBy: {
            _id: user._id,
            email: user.email
          }
        });
        return newTemplate;
      }
    
      async update(_id: string, updateTemplateDtoo, user: IUser) {
        const updated = await this.templateModel.updateOne(
          { _id },
          {
            ...updateTemplateDtoo,
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
        await this.templateModel.updateOne(
          { _id: id },
          {
            deletedBy: {
              _id: user._id,
              email: user.email
            }
          }
        );
        return this.templateModel.softDelete({ _id: id });
      }
    
    
      findAll() {
        return this.templateModel.find().exec();
    
      }
    
      async findOne(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id))
          throw new BadRequestException("Not found template with id: " + id)
        return this.templateModel.findById(id)
      }
    
}


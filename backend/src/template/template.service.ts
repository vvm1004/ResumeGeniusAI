import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template, TemplateDocument } from './schemas/template.schema';

@Injectable()
export class TemplateService {
    constructor(@InjectModel(Template.name) private templateModel: Model<TemplateDocument>) {}

    getHello(): string {
        return 'Hello from TemplateService!';
    }

    async findAll(): Promise<Template[]> {
        return this.templateModel.find().exec();
    }

    async create(templateData: any): Promise<Template> {
        const createdTemplate = new this.templateModel(templateData);
        return createdTemplate.save();
    }

    async update(id: string, updateData: any): Promise<Template> {
        return this.templateModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    // Add more methods as needed
}


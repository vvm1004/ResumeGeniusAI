import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// Import necessary elements
import { Template, TemplateSchema } from './schemas/template.schema';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Template.name, schema: TemplateSchema }])], // Add any modules required
  controllers: [TemplateController], // Register controller
  providers: [TemplateService], // Register provider
})
export class TemplateModule {}

import { Module } from '@nestjs/common';
import { ResumeBuildersService } from './resume-builders.service';
import { ResumeBuildersController } from './resume-builders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeBuilder, ResumeBuilderSchema } from './schemas/resume-builder.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ResumeBuilder.name, schema: ResumeBuilderSchema }])],

  controllers: [ResumeBuildersController],
  providers: [ResumeBuildersService],
})
export class ResumeBuildersModule { }
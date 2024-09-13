import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeBuilderDto } from './create-resume-builder.dto';

export class UpdateResumeBuilderDto extends PartialType(CreateResumeBuilderDto) {}

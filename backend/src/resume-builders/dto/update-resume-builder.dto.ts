import { PartialType } from '@nestjs/swagger';
import { CreateResumeBuilderDto } from './create-resume-builder.dto';

export class UpdateResumeBuilderDto extends PartialType(CreateResumeBuilderDto) {}

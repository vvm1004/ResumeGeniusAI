import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume-apply.dto';

export class UpdateResumeDto extends PartialType(CreateResumeDto) { }

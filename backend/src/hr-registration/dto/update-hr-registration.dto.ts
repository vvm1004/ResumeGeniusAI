import { PartialType } from '@nestjs/swagger';
import { CreateHrRegisDto } from './create-hr-registration.dto';

export class UpdateHrRegisDto extends PartialType(CreateHrRegisDto) {}

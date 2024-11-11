import { Module } from '@nestjs/common';
import { ResumeRegistrationController } from './resume-registration.controller';
import { ResumeRegistrationService } from './resume-registration.service';

import { MongooseModule } from '@nestjs/mongoose';
import { ResumeRegistration, ResumeRegistrationSchema } from './schema/schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ResumeRegistration.name, schema: ResumeRegistrationSchema }])],
  controllers: [ResumeRegistrationController],
  providers: [ResumeRegistrationService]
})
export class ResumeRegistrationModule { }

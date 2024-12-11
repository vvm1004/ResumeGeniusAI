// src/hr-registration/hr-registration.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HrRegistrationController } from './hr-registration.controller';
import { HrRegistrationService } from './hr-registration.service';
import { HrRegistration, HrRegistrationSchema } from './schema/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HrRegistration.name, schema: HrRegistrationSchema }]),
  ],
  controllers: [HrRegistrationController],
  providers: [HrRegistrationService],
})
export class HrRegistrationModule { }

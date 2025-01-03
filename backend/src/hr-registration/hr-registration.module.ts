import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HrRegistrationController } from './hr-registration.controller';
import { HrRegistrationService } from './hr-registration.service';
import {
  HrRegistration,
  HrRegistrationSchema,
} from './schemas/hr-registration.schema';
import { UsersModule } from 'src/users/users.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HrRegistration.name, schema: HrRegistrationSchema },
    ]),
    UsersModule, // Đảm bảo chỉ khai báo một lần

  ],
  controllers: [HrRegistrationController],
  providers: [HrRegistrationService, MailService],
})
export class HrRegistrationModule { }

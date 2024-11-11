import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Subcriber,
  SubcriberSchema,
} from 'src/subscribers/schemas/subscriber.schema';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';
import {
  ResumeBuilder,
  ResumeBuilderSchema,
} from 'src/resume-builders/schemas/resume-builder.schema';
import { ResumeRegistration, ResumeRegistrationSchema } from 'src/resume-registration/schema/schema';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_AUTH_USER'),
            pass: configService.get<string>('EMAIL_AUTH_PASS'),
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview:
          configService.get<string>('EMAIL_PREVIEW') === 'true' ? true : false,
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([
      { name: Subcriber.name, schema: SubcriberSchema },
      { name: Job.name, schema: JobSchema },
      { name: User.name, schema: UserSchema }, // Thêm User vào MongooseModule
      { name: ResumeBuilder.name, schema: ResumeBuilderSchema },
      { name: ResumeRegistration.name, schema: ResumeRegistrationSchema },

    ]),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule { }

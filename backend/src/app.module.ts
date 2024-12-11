import { Module, Delete } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';
import { FilesModule } from './files/files.module';
import { ResumeModule } from './resume/resume.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { DatabasesModule } from './databases/databases.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { ResumeBuildersModule } from './resume-builders/resume-builders.module';
import { ResumeUpgradeModule } from './resume-upgrade/resume-upgrade.module';
import { TemplateModule } from './template/template.module';
import { ResumeRegistrationModule } from './resume-registration/resume-registration.module';
import { JobNotificationGateway } from './websocket/JobNotificationGateway';
import { JobNotificationService } from './websocket/JobNotificationService';
import { JobNotificationModule } from './websocket/JobNotificationModule';
import { NotificationsModule } from './notifications/notifications.module';
import { HrRegistrationModule } from './hr-registration/hr-registration.module';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    //  MongooseModule.forRoot('mongodb://localhost:27017/Job_Finding'),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        }
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    UsersModule,

    AuthModule,

    CompaniesModule,

    JobsModule,

    FilesModule,

    ResumeModule,

    PermissionsModule,

    RolesModule,

    DatabasesModule,

    SubscribersModule,

    MailModule,

    HealthModule,

    ResumeBuildersModule,

    ResumeUpgradeModule,


    TemplateModule,


    ResumeRegistrationModule,

    JobNotificationModule,

    NotificationsModule,

    HrRegistrationModule,



  ],
  controllers: [AppController],
  // providers: [AppService,
  //   // {
  //   //   provide: APP_GUARD,
  //   //   useClass: JwtAuthGuard,
  //   // },

  // ],
  providers: [
    AppService,
    // JobNotificationGateway, // Đăng ký Gateway
    // JobNotificationService, // Đăng ký Service
  ],
})
export class AppModule { }

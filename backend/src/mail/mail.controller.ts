
import {
  ResumeBuilder,
  ResumeBuilderDocument,
} from './../resume-builders/schemas/resume-builder.schema';
import { Controller, Get, Param, Post, NotFoundException } from '@nestjs/common';
import { MailService } from './mail.service';
import {
  Public,
  ResponseMessage,
  SkipCheckPermission,
} from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Subcriber,
  SubcriberDocument,
} from 'src/subscribers/schemas/subscriber.schema';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema'; // import User model
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { ResumeRegistration, ResumeRegistrationDocument } from 'src/resume-registration/schema/schema';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,

    @InjectModel(Subcriber.name)
    private readonly subscriberModel: SoftDeleteModel<SubcriberDocument>,

    @InjectModel(Job.name)
    private readonly jobModel: SoftDeleteModel<JobDocument>,

    @InjectModel(User.name) // Inject User model
    private readonly userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(ResumeBuilder.name) // Inject User model
    private readonly ResumeBuilderModel: SoftDeleteModel<ResumeBuilderDocument>,


    @InjectModel(ResumeRegistration.name)
    private readonly resumeRegistrationModel: SoftDeleteModel<ResumeRegistrationDocument>,

  ) { }

  @Get()
  @Public()
  @ResponseMessage('Test email')
  @Cron('0 10 0 * * 0') //0:10 AM mỗi Chủ Nhật
  async handleTestEmail() {
    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({
        skills: { $in: subsSkills },
      });
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map((item) => ({
          name: item.name,
          company: item.company.name,
          salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ',
          skills: item.skills,
        }));
        await this.mailerService.sendMail({
          to: subs.email,
          from: '"Support Team" <support@example.com>',
          subject: 'Welcome to Nice App! Confirm your Email',
          template: 'new-job',
          context: {
            receiver: subs.name,
            jobs: jobs,
          },
        });
      }
    }
  }

  @Get(':_id/sendresume')
  @SkipCheckPermission()
  async sendResumeToUser(@Param('_id') resumeBuilderId: string) {
    // Find the resume by resumeBuilderId and retrieve imageResume
    const resumeBuilder =
      await this.ResumeBuilderModel.findById(resumeBuilderId);
    if (!resumeBuilder || !resumeBuilder.imageResume) {
      throw new NotFoundException(
        `Resume with ID ${resumeBuilderId} not found or has no image.`,
      );
    }
    const user = await this.userModel.findById(resumeBuilder.user);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${resumeBuilder.user} not found`,
      );
    }
    // Send email with imageResume as an attachment
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <support@example.com>',
      subject: 'Your Requested Resume',
      template: 'resume-email',
      context: {
        receiver: user.name,
        resumeLink: `https://yourwebsite.com/resumes/${resumeBuilderId}`,
        year: new Date().getFullYear(),
      },
      attachments: [
        {
          filename: 'resume-image.png',
          content: resumeBuilder.imageResume.split(',')[1], // Base64 data after the prefix
          encoding: 'base64',
        },
      ],
    });

    return { message: 'Resume email sent successfully with image attachment' };
  }

  @Post('send-job/:jobId')
  @Public()
  async sendJobEmailToSubscribers(@Param('jobId') jobId: string) {
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    const resumeRegister = await this.resumeRegistrationModel.find({
      $or: [
        {
          resumeSkill: { $in: job.skills }
        },
        {
          resumeSkill: { $regex: job.skills.join('|'), $options: 'i' }
        },
        {
          resumeTitle: { $regex: job.name, $options: 'i' }
        }
      ]
    });


    if (resumeRegister.length === 0) {
      console.log('No resumeRegister found with matching skills');
      return;
    }

    for (const reGis of resumeRegister) {
      await this.sendEmailToSubscriber(job, reGis);
    }

    return { message: `${resumeRegister.length} emails sent successfully` };
  }

  private async sendEmailToSubscriber(job: Job, resumeRegistration: ResumeRegistration) {
    const emailContent = {
      to: resumeRegistration.email,
      from: '"Job Finder" <support@example.com>',
      subject: `New Job Opportunity: ${job.name} at ${job.company.name}`,
      template: 'senJobTemplate',
      context: {
        receiver: resumeRegistration.userName,
        jobName: job.name,
        company: job.company.name,
        location: job.location,
        salary: `${job.salary.toLocaleString()} đ`,
        description: job.description,
        level: job.level,
        skills: job.skills.join(', '),
        startDate: job.startDate.toLocaleDateString(),
        endDate: job.endDate.toLocaleDateString(),
      },
    };

    // Gửi email
    try {
      await this.mailerService.sendMail(emailContent);
      console.log(`Email sent to ${resumeRegistration.email}`);
    } catch (error) {
      console.error(`Failed to send email to ${resumeRegistration.email}`, error);
    }
  }

}

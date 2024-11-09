import { Controller, Get, Post, Param } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Subcriber, SubcriberDocument } from 'src/subscribers/schemas/subscriber.schema';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private mailerService: MailerService,

    @InjectModel(Subcriber.name)
    private subscriberModel: SoftDeleteModel<SubcriberDocument>,

    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,

  ) {

  }

  @Get()
  @Public()
  @ResponseMessage("Test email")
  @Cron("0 10 0 * * 0") //0.10' am every sunday
  async handleTestEmail() {
    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map(item => {
          return {
            name: item.name,
            company: item.company.name,
            salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
            skills: item.skills
          }
        })
        await this.mailerService.sendMail({
          to: subs.email,
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: "new-job",
          context: {
            receiver: subs.name,
            jobs: jobs
          }
        });
      }
    }

  }

  @Post('send-job:jobId')
  @Public()
  async sendJobEmailToSubscribers(@Param('jobId') jobId: string) {
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    const subscribers = await this.subscriberModel.find({
      skills: { $in: job.skills },
    });

    if (subscribers.length === 0) {
      console.log('No subscribers found with matching skills');
      return;
    }

    for (const subscriber of subscribers) {
      await this.sendEmailToSubscriber(job, subscriber);
    }

    return { message: `${subscribers.length} emails sent successfully` };
  }

  private async sendEmailToSubscriber(job: Job, subscriber: Subcriber) {
    const emailContent = {
      to: subscriber.email,
      from: '"Job Finder" <support@example.com>',
      subject: `New Job Opportunity: ${job.name} at ${job.company.name}`,
      template: 'senJobTemplate',
      context: {
        receiver: subscriber.name,
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
      console.log(`Email sent to ${subscriber.email}`);
    } catch (error) {
      console.error(`Failed to send email to ${subscriber.email}`, error);
    }
  }

}

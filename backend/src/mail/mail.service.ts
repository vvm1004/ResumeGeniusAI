// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendHrAccountEmail(recipientEmail: string, accountDetails: { email: string; password: string; fullName: string }) {
        const emailContent = {
            to: recipientEmail,
            from: '"HR Registration" <support@example.com>',
            subject: `Your HR Account Information`,
            template: 'hr-account-email',
            context: {
                fullName: accountDetails.fullName,
                email: accountDetails.email,
                password: accountDetails.password,
            },
        };

        try {
            await this.mailerService.sendMail(emailContent);
            console.log(`HR account email sent to ${recipientEmail}`);
        } catch (error) {
            console.error(`Failed to send HR account email to ${recipientEmail}`, error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}

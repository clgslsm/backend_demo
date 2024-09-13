import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';

@Injectable()
@Processor('email')
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('sendEmail')
  async handleEmailSending(job: Job) {
    const { email1, email2 } = job.data;
    const subject = 'You have a new match!';
    const text = 'Congratulations! You have a new match on our platform.';

    await this.emailService.sendEmail([email1, email2], subject, text);
  }

  @Process('sendMonthlyReminder')
  async handleMonthlyReminder(job: Job) {
    const { email1, email2, matchDate } = job.data;
    const subject = 'Monthly Reminder';
    const text = `Please remember to chat. Your match was created on ${matchDate}.`;

    await this.emailService.sendEmail([email1, email2], subject, text);
  }
}
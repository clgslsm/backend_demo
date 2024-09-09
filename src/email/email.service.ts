// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async sendMatchNotification(email1: string, email2: string) {
    await this.emailQueue.add('sendEmail', {
      email1,
      email2,
    });
  }

  async scheduleMonthlyReminder(
    email1: string,
    email2: string,
    matchDate: Date,
  ) {
    // const cronExpression = `${matchDate.getMinutes()} ${matchDate.getHours()} ${matchDate.getDate()} * *`;
    // For testing purposes, we'll use a cron expression that runs every 10 seconds
    const cronExpression = '*/10 * * * * *';
    await this.emailQueue.add(
      'sendMonthlyReminder',
      { email1, email2, matchDate },
      { repeat: { cron: cronExpression } },
    );
  }
}

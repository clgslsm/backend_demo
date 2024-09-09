// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

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
  async sendEmail(to: string[], subject: string, text: string) {
    const domain = this.configService.get('MAILGUN_DOMAIN');
    const url = `https://api.mailgun.net/v3/${domain}/messages`;
    const authBasic = this.configService.get('MAILGUN_AUTH_BASIC');
    const auth = `Basic ${authBasic}`;
    const from = `Cupid Admin <mailgun@${domain}>`;

    const data = new FormData();
    data.append('from', from);
    data.append('to', to.join(','));
    data.append('subject', subject);
    data.append('text', text);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        Authorization: auth,
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };
    try {
      const response = await axios.request(config);
      console.log('Email sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

// src/email/email.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
@Processor('email')
export class EmailProcessor {
  constructor(private readonly configService: ConfigService) {}
  @Process('sendEmail')
  async handleEmailSending(job: Job) {
    const { email1, email2 } = job.data;
    const domain = this.configService.get('MAILGUN_DOMAIN');
    const url = `https://api.mailgun.net/v3/${domain}/messages`;
    const authBasic = this.configService.get('MAILGUN_AUTH_BASIC');
    const auth = `Basic ${authBasic}`;
    const from = `Cupid Admin <mailgun@${domain}>`;
    console.log('triggering email', email1, email2);

    // Create form data for Axios request
    const data = new FormData();
    data.append('from', from);
    data.append('to', `${email1},${email2}`);
    data.append('subject', 'You have a new match!');
    data.append(
      'text',
      'Congratulations! You have a new match on our platform.',
    );

    // Configure Axios request
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
    }
  }
  @Process('sendMonthlyReminder')
  async handleMonthlyReminder(job: Job) {
    const { email1, email2, matchDate } = job.data;
    const domain = this.configService.get('MAILGUN_DOMAIN');
    const url = `https://api.mailgun.net/v3/${domain}/messages`;
    const authBasic = this.configService.get('MAILGUN_AUTH_BASIC');
    const auth = `Basic ${authBasic}`;
    const from = `Cupid Admin <mailgun@${domain}>`;
    console.log('Processing job to send email to:', email1, email2);
    const data = new FormData();
    data.append('from', from);
    data.append('to', `${email1},${email2}`);
    data.append('subject', 'Monthly Reminder');
    data.append(
      'text',
      `Please remember to chat. Your match was created on ${matchDate}.`,
    );
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
    }
  }
}

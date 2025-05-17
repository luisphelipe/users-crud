import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class SendEmailService {
    constructor(private readonly mailerService: NestMailerService) {}

    async commit(payload: { to: string; subject: string; text?: string; html?: string }): Promise<any> {
        try {
            const response = await this.mailerService.sendMail(payload);
            return response;
        } catch (err) {
            console.log('failed to send email:', err?.message || err);
            throw new BadRequestException(err?.message || err);
        }
    }
}

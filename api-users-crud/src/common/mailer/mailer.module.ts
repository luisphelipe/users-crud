import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SendEmailService } from './services/send-email.service';

@Module({
    imports: [
        NestMailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.MAILGUN_SMTP_SERVER || process.env.EMAIL_HOSTNAME,
                    secure: false,
                    port: +(process.env.MAILGUN_SMTP_PORT || process.env.EMAIL_PORT || '300'),
                    auth: {
                        user: process.env.MAILGUN_SMTP_LOGIN || process.env.EMAIL_USERNAME,
                        pass: process.env.MAILGUN_SMTP_PASSWORD || process.env.EMAIL_PASSWORD,
                    },
                    // ignoreTLS: true,
                },
                defaults: {
                    from: process.env.EMAIL_FROM,
                },
            }),
        }),
    ],
    providers: [SendEmailService],
    exports: [SendEmailService],
})
export class MailerModule {}

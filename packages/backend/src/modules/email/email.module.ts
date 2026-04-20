import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { EMAIL_SERVICE } from './email.interface';
import { AppEmailService } from './email.service';
import { OtpLoginRequestListener } from './listeners/otp-login-request.listener';
import { WelcomeUserEmailListener } from './listeners/welcome-email.listener';
import { SMTP_CONFIG, SmtpProvider } from './providers/smtp.provider';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: SMTP_CONFIG,
      useFactory: (envService: EnvService) => {
        return {
          host: envService.get('SMTP_HOST'),
          port: envService.get('SMTP_PORT'),
          secure: envService.get('SMTP_SECURE'),
          user: envService.get('SMTP_USER'),
          password: envService.get('SMTP_PASSWORD'),
        };
      },
      inject: [EnvService],
    },
    {
      provide: EMAIL_SERVICE,
      useClass: SmtpProvider,
    },
    AppEmailService,
    WelcomeUserEmailListener,
    OtpLoginRequestListener,
  ],
  exports: [AppEmailService],
})
export class EmailModule {}

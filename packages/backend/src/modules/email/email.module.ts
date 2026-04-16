import { Module } from "@nestjs/common";
import { EMAIL_SERVICE } from "./email.interface";
import { SmtpProvider } from "./providers/smtp.provider";
import { AppEmailService } from "./email.service";

@Module({
  providers: [
    {
      provide: EMAIL_SERVICE,
      useClass: SmtpProvider,
    },
    AppEmailService,
  ],
  exports: [AppEmailService],
})
export class EmailModule { }
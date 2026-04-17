import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CronModule } from './modules/cron/cron.module';
import { EmailModule } from './modules/email/email.module';
import { EnvModule } from './modules/env/env.module';
import { EnvService } from './modules/env/env.service';
import { PropertiesModule } from './modules/properties/properties.module';
import { PropertyBookingModule } from './modules/property-booking/property-booking.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [EnvModule],
      isGlobal: true,
      inject: [EnvService],
      useFactory: (envService: EnvService) => {
        const redisUrl = envService.get('REDIS_URL');

        return {
          stores: redisUrl ? [new KeyvRedis(redisUrl)] : undefined,
        };
      },
    }),
    EventEmitterModule.forRoot(),
    CronModule,
    AuthModule,
    PropertiesModule,
    PropertyBookingModule,
    CountriesModule,
    EmailModule,
    EnvModule,
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

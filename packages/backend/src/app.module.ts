import KeyvRedis from '@keyv/redis';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { AppService } from './app.service';
import {
  APP_THROTTLE_LIMIT,
  APP_THROTTLE_TTL,
} from './common/constants/app.constants';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CronModule } from './modules/cron/cron.module';
import { EmailModule } from './modules/email/email.module';
import { EnvModule } from './modules/env/env.module';
import { EnvService } from './modules/env/env.service';
import { PropertiesModule } from './modules/properties/properties.module';
import { PropertyBookingModule } from './modules/property-booking/property-booking.module';
import { StripeWebhookModule } from './modules/stripe-webhook/stripe-webhook.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: APP_THROTTLE_TTL,
          limit: APP_THROTTLE_LIMIT,
        },
      ],
    }),
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
    BullModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        connection: {
          url: envService.get('REDIS_URL'),
        },
      }),
    }),
    EventEmitterModule.forRoot(),
    CronModule,
    AuthModule,
    PropertiesModule,
    PropertyBookingModule,
    StripeWebhookModule,
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

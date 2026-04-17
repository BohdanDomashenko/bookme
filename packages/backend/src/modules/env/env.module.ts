import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env.schema';
import { EnvService } from './env.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => {
        const parsedEnv = envSchema.safeParse(env);

        if (!parsedEnv.success) {
          const details = parsedEnv.error.issues
            .map((issue) => {
              const key = issue.path.join('.') || '(root)';
              return `- ${key}: ${issue.message}`;
            })
            .join('\n');

          throw new Error(
            `Invalid environment configuration:\n${details}\n\nCheck your .env values and try again.`,
          );
        }

        return parsedEnv.data;
      },
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}

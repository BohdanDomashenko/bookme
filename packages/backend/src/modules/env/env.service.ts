import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from './env.schema';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  get<T extends keyof EnvSchema>(key: T) {
    // biome-ignore lint/style/noNonNullAssertion: the env schema is validated and the key is guaranteed to be present
    return this.configService.get<EnvSchema[T]>(key, { infer: true })!;
  }
}

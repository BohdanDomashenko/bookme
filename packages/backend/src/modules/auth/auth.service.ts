import { randomInt } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { addMinutes } from 'date-fns';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import { EVENTS } from 'src/common/constants/events.constants';
import { PRISMA_ERROR_CODES } from 'src/common/constants/prisma.constants';
import { sanitizeUser } from 'src/common/utils/user.utils';
import { EnvService } from '../env/env.service';
import { PrismaService } from '../prisma/prisma.service';
import type { OtpLoginDto, OtpVerifyDto, SignupDto } from './dto/auth.dto';
import { OtpLoginRequestEvent } from './events/otp-login-request.event';
import { SignUpSuccessEvent } from './events/sign-up-success.event';

const OTP_LIFETIME_MINUTES = 5;
const OTP_LENGTH = 4;

@Injectable()
export class AuthService {
  JWT_SECRET?: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly envService: EnvService,
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_SECRET = this.envService.get('JWT_SECRET');
  }

  async signup(signupDto: SignupDto) {
    const country = await this.prismaService.country.findUnique({
      where: {
        code: signupDto.country_code,
      },
    });

    if (!country) {
      throw new BadRequestException('Invalid country code');
    }

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: signupDto.email,
          fullName: signupDto.full_name,
          countryCode: country.code,
        },
      });

      const sanitizedUser = sanitizeUser(user);

      this.eventEmitter.emit(
        EVENTS.AUTH.SIGNUP_SUCCESS,
        new SignUpSuccessEvent({
          user: sanitizedUser,
        }),
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log('PrismaClientKnownRequestError', JSON.stringify(error));
        if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED) {
          throw new BadRequestException('User with this email already exists');
        }
      }

      throw error;
    }
  }

  async otpLogin(otpLoginDto: OtpLoginDto) {
    const now = new Date();

    const user = await this.prismaService.user.findFirst({
      where: {
        email: otpLoginDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prismaService.userOTP.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const otp = this.generateOtp();

    await this.prismaService.userOTP.create({
      data: {
        code: otp,
        userId: user.id,
        expiresAt: addMinutes(now, OTP_LIFETIME_MINUTES),
      },
    });

    this.eventEmitter.emit(
      EVENTS.AUTH.OTP_LOGIN_REQUEST,
      new OtpLoginRequestEvent({
        user: sanitizeUser(user),
        otp,
      }),
    );
  }

  async verifyOtp(otpLoginDto: OtpVerifyDto) {
    const now = new Date();

    const user = await this.prismaService.user.findUnique({
      where: {
        email: otpLoginDto.email,
        otp: {
          code: otpLoginDto.code,
        },
      },
      include: {
        otp: true,
      },
    });

    if (!user || !user.otp) {
      throw new NotFoundException();
    }

    if (user.otp?.expiresAt < now) {
      await this.prismaService.userOTP.delete({
        where: {
          id: user.otp?.id,
        },
      });
      throw new BadRequestException('One time password already has expired');
    }

    return {
      access_token: await this.jwtService.signAsync(
        { id: user.id },
        {
          secret: this.JWT_SECRET,
        },
      ),
      user: sanitizeUser(user),
    };
  }

  private generateOtp() {
    return Array.from({ length: OTP_LENGTH })
      .map(() => randomInt(0, 9))
      .join('');
  }
}

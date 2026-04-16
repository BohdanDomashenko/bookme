import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { OtpLoginDto, OtpVerifyDto, SignupDto } from './dto/auth.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import { PRISMA_ERROR_CODES } from 'src/common/constants/prisma.constants';
import { sanitizeUser } from 'src/common/utils/user.utils';
import { addDays, addMinutes } from 'date-fns';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import assert from 'node:assert';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from 'src/common/constants/events.constants';
import { SignUpSuccessEvent } from './events/sign-up-success.event';

const OTP_LIFETIME_MINUTES = 5;

@Injectable()
export class AuthService {
  JWT_SECRET?: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET');

    assert(this.JWT_SECRET, 'JWT_SECRET is not defined');
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

      this.eventEmitter.emit(EVENTS.AUTH.SIGNUP_SUCCESS, new SignUpSuccessEvent({
        user: sanitizedUser,
      }));
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

    await this.prismaService.userOTP.create({
      data: {
        code: this.generateOtp(),
        userId: user.id,
        expiresAt: addMinutes(now, OTP_LIFETIME_MINUTES),
      },
    });

    // @todo: Send OTP email to the user
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
    // @TODO: Generate a random OTP
    return '1111';
  }
}

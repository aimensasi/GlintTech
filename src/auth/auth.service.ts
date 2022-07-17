import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as Argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: AuthDto): Promise<{ access_token: string }> {
    try {
      const hash = await Argon.hash(data.password);

      const user = await this.prismaService.user.create({
        data: { email: data.email, password: hash },
      });

      return this.generateToken(user.email, user.id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email must be unique');
        }
      }

      throw error;
    }
  }

  async login(data: AuthDto): Promise<{ access_token: string }> {
    const user = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });

    if (!user) {
      throw new ForbiddenException('Credential is wrong');
    }

    const isMatch = await Argon.verify(user.password, data.password);

    if (!isMatch) {
      throw new ForbiddenException('Credential is wrong');
    }

    return this.generateToken(user.email, user.id);
  }

  async generateToken(
    email: string,
    userId: number,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    });

    return { access_token: token };
  }
}

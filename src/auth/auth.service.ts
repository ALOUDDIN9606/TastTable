import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { User } from '@prisma/client';
import { SignInDto } from './dto/sign-in.dto';
import { JwtPayload, ResponceType, Tokens } from 'src/common/types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async generateToken(user: User): Promise<Tokens> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
    };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }

  async updateRefreshToken(userId: number, refresh_token: string) {
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 7);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken,
      },
    });
  }

  async signUp(createAuthDto: CreateAuthDto, res: Response): Promise<ResponceType> {
    const candidate = await this.prismaService.user.findUnique({
      where: { email: createAuthDto.email },
    });
    if (candidate) {
      throw new BadRequestException('User already exists');
    }

    if (createAuthDto.password !== createAuthDto.confirmPassword) {
      throw new BadRequestException('Parollar mos emas');
    }
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 7);

    const newUser = await this.prismaService.user.create({
      data: {
        name: createAuthDto.name,
        email: createAuthDto.email,
        hashedPassword,
      },
    });

    const tokens = await this.generateToken(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.COOKIE_TIME,
    });
    return { id: newUser.id, access_token: tokens.access_token };
  }

  async signIn(signInDto: SignInDto, res: Response): Promise<ResponceType> {
    const { email, password } = signInDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      throw new BadRequestException('Password is incorrect');
    }

    const tokens = await this.generateToken(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.COOKIE_TIME,
    });

    return { id: user.id, access_token: tokens.access_token };
  }

  async signOut(userId: number, res: Response) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });

    res.clearCookie('refresh_token');
    
    return { message: 'User logged out' };
  }

  async refreshToken(userId: number, res: Response): Promise<ResponceType> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const tokens = await this.generateToken(user);

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.COOKIE_TIME,
    });

    return { id: user.id, access_token: tokens.access_token };
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

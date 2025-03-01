import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AccesstokenStrategy, RefreshTokenCookieStrategy } from 'src/common/strategies';

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccesstokenStrategy,
    RefreshTokenCookieStrategy
  ],
})
export class AuthModule {}




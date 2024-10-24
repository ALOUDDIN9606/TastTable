import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Request, Response } from 'express';
import { ResponceType } from 'src/common/types';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/common/guards';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { GetCurrentUserUd } from 'src/common/decorators/get-current-user-id.decarator';


@UseGuards(AccessTokenGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async singup(
    @Body() createAuthDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponceType> {
    return this.authService.signUp(createAuthDto, res);
  }

  @Public()
  @Post('signin')
  async signin(
    @Body() createAuthDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponceType> {
    return this.authService.signIn(createAuthDto, res);
  }

  @Public()  
  @UseGuards(AccessTokenGuard) 
  @UseGuards(RefreshTokenGuard)  
  @Post('singout')
  @HttpCode(HttpStatus.OK)
  signout(@GetCurrentUserUd() userId: number, @Res({passthrough: true}) res: Response){
    return this.authService.signOut(userId, res);
  }

  // @Public()
  // @UseGuards(RefreshTokenGuard)
  // @Post('refresh')
  // async refreshTokens(
  //   @GetCurrentUserUd() userId: number, 
  //   @GetCurrentUser('refreshToken') refreshToken: string,
  //   @Res({passthrough: true}) res: Response,
  // ): Promise<ResponseFie> {
  //   return this.authService.refreshToken(+userId, refreshToken, res)
  // }


  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

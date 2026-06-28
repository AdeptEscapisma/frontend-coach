import { Controller, Post, Body, Res, UsePipes } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';
import { AuthService } from './auth.service';
import { registerSchema } from './dto/register.dto';
import type { RegisterDto } from './dto/register.dto';
import { AppConfiguration } from 'src/common/configuration';

@Controller('auth')
export class AuthController {
  private readonly isProduction: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AppConfiguration, true>,
  ) {
    this.isProduction = this.configService.get('isProduction', { infer: true })!;
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.register(dto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict',
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict',
      path: '/',
    });

    return {
      id: user.id,
      login: user.login,
      name: user.name,
      birthday: user.birthday,
      gender: user.gender,
    };
  }
}

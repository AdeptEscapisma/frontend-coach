import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpCode,
  UsePipes,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';
import { Cookies } from '../../common/decorators/cookies.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { loginSchema } from './dto/login.dto';
import type { LoginDto } from './dto/login.dto';
import { registerSchema } from './dto/register.dto';
import type { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { User } from '../users/entities/user.entity';
import { AppConfiguration } from 'src/common/configuration';
import { serializeUser } from '../../common/serializers/user.serializer';

@Controller('auth')
export class AuthController {
  private readonly isProduction: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AppConfiguration, true>,
  ) {
    this.isProduction = this.configService.get('isProduction', { infer: true })!;
  }

  private get cookieOptions() {
    return {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict' as const,
      path: '/',
    };
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.register(dto);

    res.cookie('access_token', accessToken, this.cookieOptions);
    res.cookie('refresh_token', refreshToken, this.cookieOptions);

    return serializeUser(user);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.login(dto);

    res.cookie('access_token', accessToken, this.cookieOptions);
    res.cookie('refresh_token', refreshToken, this.cookieOptions);

    return serializeUser(user);
  }

  @Post('refresh')
  async refresh(
    @Cookies('refresh_token') token: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!token) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    const { user, accessToken, refreshToken } = await this.authService.refresh(token);

    res.cookie('access_token', accessToken, this.cookieOptions);
    res.cookie('refresh_token', refreshToken, this.cookieOptions);

    return serializeUser(user);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Cookies('refresh_token') token: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (token) {
      await this.authService.logout(token);
    }

    res.clearCookie('access_token', this.cookieOptions);
    res.clearCookie('refresh_token', this.cookieOptions);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return serializeUser(user);
  }
}

import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenSchema } from './entities/refresh-token.entity';
import { User, UserSchema } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AppConfiguration } from 'src/common/configuration';

@Injectable()
export class AuthService {
  private readonly refreshExpiresIn: string;
  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfiguration, true>,
    private readonly usersService: UsersService,
  ) {
    const jwtConfig = this.configService.get('jwt', { infer: true });
    this.refreshExpiresIn = jwtConfig.refreshExpiresIn;
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByLogin(dto.login);
    if (existing) {
      throw new ConflictException('Login already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user: User = this.em.create(UserSchema, {
      login: dto.login,
      password: hashedPassword,
      name: dto.name,
      birthday: dto.birthday,
      gender: dto.gender,
    });

    await this.em.persist(user).flush();

    const tokens = await this.generateTokens(user.id, user.login);

    return { user, ...tokens };
  }

  private async generateTokens(userId: string, login: string) {
    const accessToken = this.jwtService.sign({ sub: userId, login });

    const jti = uuidv4();
    const refreshToken = this.jwtService.sign(
      { sub: userId, jti },
      { expiresIn: this.refreshExpiresIn as `${number}${'s' | 'm' | 'h' | 'd'}` },
    );

    const expiresAt = this.parseExpiry(this.refreshExpiresIn);

    const refreshTokenEntity = this.em.create(RefreshTokenSchema, {
      jti,
      user: userId,
      expiresAt,
    });

    await this.em.persist(refreshTokenEntity).flush();

    return { accessToken, refreshToken };
  }

  private parseExpiry(expiresIn: string): Date {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * (multipliers[unit] ?? multipliers.d));
  }
}

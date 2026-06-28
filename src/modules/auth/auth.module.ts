import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenSchema } from './entities/refresh-token.entity';
import { UsersModule } from '../users/users.module';
import { AppConfiguration } from 'src/common/configuration';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfiguration, true>) => {
        const { secret, expiresIn } = configService.get('jwt', { infer: true });

        return {
          secret,
          signOptions: { expiresIn: expiresIn as `${number}${'s' | 'm' | 'h' | 'd'}` },
        };
      },
    }),
    MikroOrmModule.forFeature([RefreshTokenSchema]),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

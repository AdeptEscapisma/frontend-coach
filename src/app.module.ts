import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { AppConfiguration, configuration } from './common/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AppConfiguration, true>) => {
        const dbConfig = configService.get('database', { infer: true });

        return {
          host: dbConfig?.host,
          port: dbConfig?.port,
          user: dbConfig?.user,
          password: dbConfig?.password,
          dbName: dbConfig?.dbName,
          entities: dbConfig?.entities,
        };
      },
      inject: [ConfigService],
      driver: PostgreSqlDriver,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

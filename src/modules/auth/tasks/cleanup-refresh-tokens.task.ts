import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateRequestContext } from '@mikro-orm/decorators/legacy';
import { MikroORM } from '@mikro-orm/core';
import { RefreshTokenSchema } from '../entities/refresh-token.entity';

@Injectable()
export class CleanupRefreshTokensTask {
  private readonly logger = new Logger(CleanupRefreshTokensTask.name);

  constructor(private readonly orm: MikroORM) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @CreateRequestContext()
  async cleanExpiredTokens() {
    this.logger.log('Cleaning up expired refresh tokens');
    const deleted = await this.orm.em.nativeDelete(RefreshTokenSchema, {
      expiresAt: { $lt: new Date() },
    });

    if (deleted > 0) {
      this.logger.log(`Deleted ${deleted} expired refresh token(s)`);
    }
  }
}

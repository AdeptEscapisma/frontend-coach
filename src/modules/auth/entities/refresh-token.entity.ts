import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { UserSchema } from '../../users/entities/user.entity';

export const RefreshTokenSchema = defineEntity({
  name: 'RefreshToken',
  tableName: 'refresh_tokens',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => uuidv4()),
    jti: p.string().unique(),
    user: () => p.manyToOne(UserSchema),
    expiresAt: p.datetime(),
    isRevoked: p.boolean().onCreate(() => false),
    createdAt: p.datetime().onCreate(() => new Date()),
  },
});

export type RefreshToken = InferEntity<typeof RefreshTokenSchema>;

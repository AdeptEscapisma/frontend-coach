import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export const UserSchema = defineEntity({
  name: 'User',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => uuidv4()),
    login: p.string().unique(),
    password: p.string(),
    name: p.string(),
    birthday: p.date(),
    gender: p.string(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export type User = InferEntity<typeof UserSchema>;

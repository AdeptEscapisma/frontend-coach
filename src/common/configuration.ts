import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DB_HOST: z.string().min(1).default('localhost'),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  DB_USER: z.string().min(1).default('postgres'),
  DB_PASSWORD: z.string().min(1).default('postgres'),
  DB_NAME: z.string().min(1).default('sandbox'),
  JWT_SECRET: z.string().min(10).default('super-secret-key'),
  JWT_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/)
    .default('15m'),
  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/)
    .default('7d'),
  CORS_ORIGIN: z.string().default('*'),
});

export interface AppConfiguration {
  port: number;
  environment: string;
  isProduction: boolean;
  database: DatabaseConfiguration;
  jwt: JwtConfiguration;
  cors: CorsConfiguration;
}

export interface JwtConfiguration {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface DatabaseConfiguration {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
  entities: string[];
}

export interface CorsConfiguration {
  origin: string;
}

export const configuration = (): AppConfiguration => {
  const env = envSchema.parse(process.env);

  return {
    port: env.PORT,
    environment: env.NODE_ENV,
    isProduction: env.NODE_ENV === 'production',
    database: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      dbName: env.DB_NAME,
      entities: ['dist/**/*.entity.js'],
    },
    jwt: {
      secret: env.JWT_SECRET,
      expiresIn: env.JWT_EXPIRES_IN,
      refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },
    cors: {
      origin: env.CORS_ORIGIN,
    },
  };
};

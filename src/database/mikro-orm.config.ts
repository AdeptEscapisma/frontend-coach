import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { defineConfig } from '@mikro-orm/sqlite';
import { Migrator } from '@mikro-orm/migrations';
import { configuration } from '../common/configuration';

dotenv.config({ path: resolve(__dirname, '../../.env'), quiet: true });

const config = configuration();

export default defineConfig({
  dbName: config.database.dbName,
  entities: ['dist/**/*.entity.js'],
  extensions: [Migrator],
  migrations: {
    path: './src/database/migrations',
    glob: '!(*.d).{js,ts}',
  },
});

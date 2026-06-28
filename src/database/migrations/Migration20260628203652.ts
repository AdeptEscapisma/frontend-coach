import { Migration } from '@mikro-orm/migrations';

export class Migration20260628203652 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table \`user\` (\`id\` text not null primary key, \`login\` text not null, \`password\` text not null, \`name\` text not null, \`birthday\` date not null, \`gender\` text not null, \`created_at\` datetime not null, \`updated_at\` datetime not null);`);
    this.addSql(`create unique index \`user_login_unique\` on \`user\` (\`login\`);`);

    this.addSql(`create table \`refresh_tokens\` (\`id\` text not null primary key, \`jti\` text not null, \`user_id\` text not null, \`expires_at\` datetime not null, \`is_revoked\` integer not null, \`created_at\` datetime not null, constraint \`refresh_tokens_user_id_foreign\` foreign key (\`user_id\`) references \`user\` (\`id\`));`);
    this.addSql(`create unique index \`refresh_tokens_jti_unique\` on \`refresh_tokens\` (\`jti\`);`);
    this.addSql(`create index \`refresh_tokens_user_id_index\` on \`refresh_tokens\` (\`user_id\`);`);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20260626044042_CreateUserTable extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "user" ("id" uuid not null, "login" varchar(255) not null, "password" varchar(255) not null, "name" varchar(255) not null, "birthday" date not null, "gender" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
  }
}

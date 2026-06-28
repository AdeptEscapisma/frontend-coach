import { Migration } from '@mikro-orm/migrations';

export class Migration20260626050505 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "refresh_tokens" ("id" uuid not null, "jti" varchar(255) not null, "user_id" uuid not null, "expires_at" timestamptz not null, "is_revoked" boolean not null, "created_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "refresh_tokens" add constraint "refresh_tokens_jti_unique" unique ("jti");`,
    );
    this.addSql(
      `alter table "refresh_tokens" add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`,
    );
    this.addSql(`create index "refresh_tokens_user_id_index" on "refresh_tokens" ("user_id");`);

    this.addSql(`alter table "user" add constraint "user_login_unique" unique ("login");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "refresh_tokens" cascade;`);

    this.addSql(`alter table "user" drop constraint "user_login_unique";`);

    this.addSql(`drop index if exists "refresh_tokens_user_id_index";`);
  }
}

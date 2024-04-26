CREATE TABLE IF NOT EXISTS "enterprises" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"company_logo" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_fields" (
	"id" uuid PRIMARY KEY NOT NULL,
	"field_name" text,
	"field_type" text,
	"description" text,
	"conditions" text[],
	"options" text[],
	"required" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"step_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_responses_drafts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"response" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"form_id" uuid,
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_responses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"response" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"form_id" uuid,
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_steps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"form_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "forms" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"state" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"work_group_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now(),
	"scopes" text[],
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"enterprise_id" uuid,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "work_group_members" (
	"user_id" uuid,
	"work_group_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "work_group_members_user_id_work_group_id_pk" PRIMARY KEY("user_id","work_group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "work_groups" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"enterprise_id" uuid,
	CONSTRAINT "work_groups_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_step_id_form_steps_id_fk" FOREIGN KEY ("step_id") REFERENCES "form_steps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_responses_drafts" ADD CONSTRAINT "form_responses_drafts_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_responses_drafts" ADD CONSTRAINT "form_responses_drafts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_steps" ADD CONSTRAINT "form_steps_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "forms" ADD CONSTRAINT "forms_work_group_id_work_groups_id_fk" FOREIGN KEY ("work_group_id") REFERENCES "work_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_enterprise_id_enterprises_id_fk" FOREIGN KEY ("enterprise_id") REFERENCES "enterprises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_group_members" ADD CONSTRAINT "work_group_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_group_members" ADD CONSTRAINT "work_group_members_work_group_id_work_groups_id_fk" FOREIGN KEY ("work_group_id") REFERENCES "work_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_groups" ADD CONSTRAINT "work_groups_enterprise_id_enterprises_id_fk" FOREIGN KEY ("enterprise_id") REFERENCES "enterprises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

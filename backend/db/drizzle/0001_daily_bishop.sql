CREATE TABLE IF NOT EXISTS "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text,
	"value" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);

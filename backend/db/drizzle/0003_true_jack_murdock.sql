ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_user_id_role_id_pk";--> statement-breakpoint
ALTER TABLE "user_roles" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_roles" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "user_roles" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "user_roles" DROP COLUMN IF EXISTS "deleted_at";
ALTER TABLE "form_fields" ALTER COLUMN "step_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "form_responses" ALTER COLUMN "form_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "form_responses" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "form_steps" ALTER COLUMN "form_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "work_groups" ALTER COLUMN "enterprise_id" SET NOT NULL;
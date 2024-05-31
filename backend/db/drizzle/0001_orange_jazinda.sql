ALTER TABLE "forms" ADD COLUMN "enterprise_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "forms" ADD CONSTRAINT "forms_enterprise_id_enterprises_id_fk" FOREIGN KEY ("enterprise_id") REFERENCES "enterprises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

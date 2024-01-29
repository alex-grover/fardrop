CREATE TABLE IF NOT EXISTS "drop" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"creator_fid" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "participant" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"drop_id" integer NOT NULL,
	"caster_fid" text NOT NULL,
	"participant_fid" integer NOT NULL,
	CONSTRAINT "participant_drop_id_caster_fid_participant_fid_pk" PRIMARY KEY("drop_id","caster_fid","participant_fid")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participant" ADD CONSTRAINT "participant_drop_id_drop_id_fk" FOREIGN KEY ("drop_id") REFERENCES "drop"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

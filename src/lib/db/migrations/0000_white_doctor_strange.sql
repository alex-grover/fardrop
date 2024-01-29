CREATE TABLE IF NOT EXISTS "drop" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"name" text NOT NULL,
	"creator_fid" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "participant" (
	"created_at" timestamp DEFAULT now(),
	"drop_id" integer NOT NULL,
	"fid" integer NOT NULL,
	"caster_fid" integer NOT NULL,
	CONSTRAINT "participant_drop_id_fid_caster_fid_pk" PRIMARY KEY("drop_id","fid","caster_fid")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participant" ADD CONSTRAINT "participant_drop_id_drop_id_fk" FOREIGN KEY ("drop_id") REFERENCES "drop"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

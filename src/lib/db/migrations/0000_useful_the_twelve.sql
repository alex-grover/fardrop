CREATE TABLE IF NOT EXISTS "frame" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"name" text NOT NULL,
	"creator_fid" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "participant" (
	"created_at" timestamp DEFAULT now(),
	"frame_id" integer NOT NULL,
	"caster_fid" text NOT NULL,
	"participant_fid" integer NOT NULL,
	CONSTRAINT "participant_frame_id_caster_fid_participant_fid_pk" PRIMARY KEY("frame_id","caster_fid","participant_fid")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participant" ADD CONSTRAINT "participant_frame_id_frame_id_fk" FOREIGN KEY ("frame_id") REFERENCES "frame"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

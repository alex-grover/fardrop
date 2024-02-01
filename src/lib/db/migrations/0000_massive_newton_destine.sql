CREATE TABLE IF NOT EXISTS "cast" (
	"hash" text PRIMARY KEY NOT NULL,
	"caster_fid" integer NOT NULL,
	"caster_username" text,
	"caster_avatar" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "drop" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"name" text NOT NULL,
	"creator_fid" integer NOT NULL,
	"creator_username" text,
	"creator_avatar" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "participant" (
	"created_at" timestamp DEFAULT now(),
	"drop_id" integer NOT NULL,
	"cast_hash" text NOT NULL,
	"participant_fid" integer NOT NULL,
	"participant_username" text,
	"participant_avatar" text,
	"participant_address" text NOT NULL,
	CONSTRAINT "participant_drop_id_participant_fid_pk" PRIMARY KEY("drop_id","participant_fid")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participant" ADD CONSTRAINT "participant_drop_id_drop_id_fk" FOREIGN KEY ("drop_id") REFERENCES "drop"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participant" ADD CONSTRAINT "participant_cast_hash_cast_hash_fk" FOREIGN KEY ("cast_hash") REFERENCES "cast"("hash") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

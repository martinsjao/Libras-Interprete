CREATE TABLE "perfis" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL UNIQUE,
	"email" text NOT NULL UNIQUE,
	"nome" text NOT NULL,
	"papel" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

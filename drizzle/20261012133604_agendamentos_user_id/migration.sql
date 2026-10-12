ALTER TABLE "agendamentos" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "perfis" ALTER COLUMN "papel" SET DEFAULT 'cliente';
CREATE TABLE "agendamentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipo" text NOT NULL,
	"data" date NOT NULL,
	"horario" text NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"telefone" text,
	"observacoes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "agendamentos_data_horario_unique" UNIQUE("data","horario")
);

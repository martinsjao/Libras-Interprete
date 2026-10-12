import { date, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';

/** Perfil da aplicação ligado ao usuário do Better Auth (`neon_auth.user`). */
export const perfis = pgTable('perfis', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  email: text('email').notNull().unique(),
  nome: text('nome').notNull(),
  /** `cliente` no cadastro público; `interprete` só por promoção admin. */
  papel: text('papel').notNull().default('cliente'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/** Agendamento sempre vinculado a um usuário autenticado. */
export const agendamentos = pgTable(
  'agendamentos',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    tipo: text('tipo').notNull(),
    data: date('data').notNull(),
    horario: text('horario').notNull(),
    nome: text('nome').notNull(),
    email: text('email').notNull(),
    telefone: text('telefone'),
    observacoes: text('observacoes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [unique('agendamentos_data_horario_unique').on(table.data, table.horario)],
);

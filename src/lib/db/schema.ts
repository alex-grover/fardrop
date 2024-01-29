import {
  serial,
  text,
  timestamp,
  pgTable,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core'

export const drop = pgTable('drop', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  name: text('name').notNull(),
  creatorFid: integer('creator_fid').notNull(),
})

export const participant = pgTable(
  'participant',
  {
    createdAt: timestamp('created_at').notNull().defaultNow(),
    dropId: integer('drop_id')
      .notNull()
      .references(() => drop.id),
    casterFid: text('caster_fid').notNull(),
    participantFid: integer('participant_fid').notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.dropId, table.casterFid, table.participantFid],
    }),
  }),
)

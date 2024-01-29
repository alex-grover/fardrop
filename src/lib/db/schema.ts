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
  createdAt: timestamp('created_at').defaultNow(),
  name: text('name').notNull(),
  creatorFid: integer('creator_fid').notNull(),
})

export const participant = pgTable(
  'participant',
  {
    createdAt: timestamp('created_at').defaultNow(),
    dropId: integer('drop_id')
      .notNull()
      .references(() => drop.id),
    fid: integer('fid').notNull(),
    casterFid: integer('caster_fid').notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.dropId, table.fid, table.casterFid],
    }),
  }),
)

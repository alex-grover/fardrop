import {
  serial,
  text,
  timestamp,
  pgTable,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core'

export const frame = pgTable('frame', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  name: text('name').notNull(),
  creatorFid: integer('creator_fid').notNull(),
})

export const participant = pgTable(
  'participant',
  {
    createdAt: timestamp('created_at').defaultNow(),
    frameId: integer('frame_id')
      .notNull()
      .references(() => frame.id),
    casterFid: text('caster_fid').notNull(),
    participantFid: integer('participant_fid').notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.frameId, table.casterFid, table.participantFid],
    }),
  }),
)

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
  creatorUsername: text('creator_username'),
  creatorAvatar: text('creator_avatar'),
})

export const cast = pgTable('cast', {
  hash: text('hash').primaryKey(),
  casterFid: integer('caster_fid').notNull(),
  casterUsername: text('caster_username'),
  casterAvatar: text('caster_avatar'),
})

export const participant = pgTable(
  'participant',
  {
    createdAt: timestamp('created_at').defaultNow(),
    dropId: integer('drop_id')
      .notNull()
      .references(() => drop.id),
    castHash: text('cast_hash')
      .notNull()
      .references(() => cast.hash),
    participantFid: integer('participant_fid').notNull(),
    participantUsername: text('participant_username'),
    participantAvatar: text('participant_avatar'),
    participantAddress: text('participant_address').notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.dropId, table.participantFid],
    }),
  }),
)

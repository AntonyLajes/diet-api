import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('diets', (table) => {
        table.uuid('id').primary()
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable()
        table.string('title').notNullable()
        table.string('description').notNullable()
        table.boolean('on_a_diet').notNullable()
        table.timestamp('created_at').after('user_id').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('diets')
}


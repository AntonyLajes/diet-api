import knexSetup, { Knex } from "knex"

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: './db/tmp/app.db'
    },
    useNullAsDefault: true,
    migrations: {
        directory: './db/migrations',
        extension: 'ts'
    }
}

export const knex = knexSetup(config)
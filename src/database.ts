import knexSetup, { Knex } from "knex"
import { env } from "../env"

export const config: Knex.Config = {
    client: env.DB_CLIENT,
    connection: env.DB_CLIENT === "sqlite" ? {
        filename: env.DATABASE_URL
    } : env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
        directory: './db/migrations',
        extension: 'ts'
    }
}

export const knex = knexSetup(config)
import { Knex } from "knex"

declare module 'knex/types/tables' {
    export interface Tables{
        users: {
            id: string,
            name: string,
            email: string,
            password: string
        },
        diets: {
            id: string,
            user_id: string,
            title: string,
            description: string,
            on_a_diet: boolean,
            created_at: string
        }
    }
}
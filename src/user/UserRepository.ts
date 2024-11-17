import KnexSetup from "knex"
import { knex } from "../database"

export class UserRepository{

    constructor(private database: KnexSetup.Knex){}

    async findByEmail(email: string){
        return await knex('users').where('email', email).first()
    }

    async register(user: UserDTO){
        return await knex('users').insert(user).returning('*')
    }
}
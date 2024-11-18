import KnexSetup from "knex"
import { knex } from "../database"

export class DietRepository{

    constructor(private database: KnexSetup.Knex){}

    async save(diet: DietDTO){
        return await this.database('diets').insert(diet).returning('*')
    }

}
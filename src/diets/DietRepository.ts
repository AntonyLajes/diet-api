import KnexSetup from "knex"
import { knex } from "../database"

export class DietRepository {

    constructor(private database: KnexSetup.Knex) { }

    async save(diet: DietDTO) {
        return await this.database('diets').insert(diet).returning('*')
    }

    async update(diet: DietDTO) {
        return await this.database('diets')
            .where(
                {
                    user_id: diet.user_id,
                    id: diet.id
                }
            )
            .update(diet)
            .returning('*')
    }

    async delete(id: string){
        return await this.database('diets').where('id', id).delete()
    }

    async findByUserId(userId: string){
        return await this.database('diets').where('user_id', userId).select('*')
    }

}
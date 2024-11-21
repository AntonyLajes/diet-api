import { DietRepository } from "./DietRepository";

export class DietService{

    constructor(private dietRepository: DietRepository){}

    async save(diet: DietDTO){
        return await this.dietRepository.save(diet)
    }
    
    async update(diet: DietDTO){
        return await this.dietRepository.update({
            id: diet.id,
            title: diet.title,
            description: diet.description,
            on_a_diet: diet.on_a_diet,
            user_id: diet.user_id
        })
    }

}
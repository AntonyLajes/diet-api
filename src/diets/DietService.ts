import DietError from "../error/DietError";
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

    async delete(id: string){
        const deleteCode = await this.dietRepository.delete(id)
        if(deleteCode === 0) throw new DietError('Diet not found.')

        return deleteCode
    }

    async findAll(userId: string){
        return await this.dietRepository.findAll(userId)
    }

    async findById(userId: string, id: string){
        return await this.dietRepository.findById(userId, id)
    }

    async findTotalDiets(userId: string){
        return await this.findAll(userId)
    }

    async findOnADiet(userId: string, on_a_diet: boolean){
        return await this.dietRepository.findByOnADiet(userId, on_a_diet)
    }

    async findBestSequence(userId: string){
        const diets: DietDTO[] = await this.dietRepository.findAll(userId)
        
        let bestSequencyDiets: DietDTO[] = []
        let currentSequencyDiets: DietDTO[] = []
        for(const diet of diets){
            if(diet.on_a_diet){
                currentSequencyDiets.push(diet)
                if(currentSequencyDiets.length> bestSequencyDiets.length){
                    bestSequencyDiets = [...currentSequencyDiets]
                }
            }else{
                currentSequencyDiets = []
            }
        }

        return bestSequencyDiets
    }

}
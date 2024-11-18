import { DietRepository } from "./DietRepository";

export class DietService{

    constructor(private dietRepository: DietRepository){}

    async save(diet: DietDTO){
        return await this.dietRepository.save(diet)
    }

}
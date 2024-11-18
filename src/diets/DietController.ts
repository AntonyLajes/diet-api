import { FastifyRequest } from "fastify";
import { DietService } from "./DietService";
import { DietRequestBodyDTO } from "./dtos/DietRequestBodyDTO";
import { randomUUID } from "crypto";

export class DietController{

    constructor(private dietService: DietService){}

    async save(request: FastifyRequest<{Body: DietRequestBodyDTO}>){
        const { title, description, on_a_diet } = request.body
        if(!title || !description || typeof on_a_diet === "undefined") return { code: 400, body: { message: 'Parameters title, description and on_a_diet are required.' } }
    
        const user = request.user
        if(!user) return { code: 401, body: {message: 'Unauthorized: User logged in not valid.'}}
        
        try {
            const diet: DietDTO = {
                id: randomUUID(),
                user_id: user.id,
                title,
                description,
                on_a_diet
            }
            const created_diet = await this.dietService.save(diet)
            return { code: 200, body: created_diet}
        } catch (error) {
            console.log('error', error);
            
            return { code: 400, body: { message: 'Unexpected error occurred.' } }
        }
    }

}
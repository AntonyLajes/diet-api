import { FastifyInstance, FastifyRequest } from "fastify"
import { AuthService } from "../auth/AuthService"
import { UserRepository } from "../user/UserRepository"
import { knex } from "../database"
import { DietRepository } from "../diets/DietRepository"
import { DietService } from "../diets/DietService"
import { DietController } from "../diets/DietController"
import { DietRequestBodyDTO } from "../diets/dtos/DietRequestBodyDTO"
import { DietParamsDTO } from "../diets/dtos/DietParamsDTO"

export async function dietsRoutes(server: FastifyInstance){

    const userRepository = new UserRepository(knex)
    const authService = new AuthService(userRepository)

    const dietRepository = new DietRepository(knex)
    const dietService = new DietService(dietRepository)
    const dietController = new DietController(dietService)

    server.addHook('preHandler', async (req, reply) => {
        const token = req.headers.authorization?.replace(/^Bearer /, "")
        if(!token) return reply.code(401).send("Unauthorized: Token missing.")

        const user = await authService.verifyToken(token)
        if(!user) return reply.code(401).send({ message: "Unauthorized: Invalid token." })
        
        req.user = user
    })

    server.post('/new', async (req, reply) => {
        const { code, body } = await dietController.save(req as FastifyRequest<{Body: DietRequestBodyDTO}>)
        console.log(`body`, body);
        
        reply.code(code).send(body)
    })

    server.put('/update/:id', async (req, reply) => {
        const { code, body } = await dietController.update(req as FastifyRequest<{Body: DietRequestBodyDTO, Params: DietParamsDTO}>)

        reply.code(code).send(body)
    })

    server.delete('/delete/:id', async (req, reply) => {
        const { code, body } = await dietController.delete(req as FastifyRequest<{Params: DietParamsDTO}>)
        reply.code(code).send(body)
    })

    server.get('/', async (req, reply) => {
        const { code, body } = await dietController.findByUserId(req)
        reply.code(code).send(body)
    })

}
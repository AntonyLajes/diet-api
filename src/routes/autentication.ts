import { FastifyInstance, FastifyRequest } from "fastify";
import { UserRepository } from "../user/UserRepository";
import { knex } from "../database";
import { AuthService } from "../auth/AuthService";
import { AuthController } from "../auth/AuthController";

export function autenticationRoutes(server: FastifyInstance){
    
    const userRepository = new UserRepository(knex)
    const authService = new AuthService(userRepository)
    const authController = new AuthController(authService)

    server.post('/register', async (req, reply) => {
        const { code, body } = await authController.register(req as FastifyRequest<{Body: UserRequestBodyDTO}>)
        reply.code(code).send(body)
    })

}
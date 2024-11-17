import { FastifyInstance } from "fastify"
import { AuthService } from "../auth/AuthService"
import { UserRepository } from "../user/UserRepository"
import { knex } from "../database"

export async function dietsRoutes(server: FastifyInstance){

    const userRepository = new UserRepository(knex)
    const authService = new AuthService(userRepository)

    server.addHook('preHandler', async (req, reply) => {
        const token = req.headers.authorization?.replace(/^Bearer /, "")
        if(!token) return reply.code(401).send("Unauthorized: Token missing.")

        const user = await authService.verifyToken(token)
        if(!user) return reply.code(401).send({ message: "Unauthorized: Invalid token." })
        
        req.user = user
    })

    server.get('/', async (req, reply) => {
        reply.code(200).send(req.user)
    })

}
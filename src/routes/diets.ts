import { FastifyInstance } from "fastify"

export async function dietsRoutes(server: FastifyInstance){

    server.post('/', async (req, reply) => {
        console.log(req.body);
    })

}
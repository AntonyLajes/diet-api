import fastify from "fastify"
import { dietsRoutes } from "./routes/diets"
import { autenticationRoutes } from "./routes/autentication"

export const app = fastify()

app.register(autenticationRoutes, { prefix: 'auth'})
app.register(dietsRoutes, { prefix: 'diets' })
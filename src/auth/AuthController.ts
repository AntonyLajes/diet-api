import { FastifyRequest } from "fastify";
import AuthError from "../error/AuthError";
import { AuthService } from "./AuthService";
import bcrypt from "bcrypt"
import { randomUUID } from "crypto";

export class AuthController{
    constructor(private authService: AuthService){}

    async register(request: FastifyRequest<{Body: UserRequestBodyDTO}>){
        const { name, email, password} = request.body
        if(!name || !email || !password) return { code: 400, body: { message: 'Properties name, email, and password are required.'} }
    
        try {
            const user: UserDTO = {
                id: randomUUID(),
                name,
                email,
                password: bcrypt.hashSync(password, 10)
            }

            const createdUser = await this.authService.register(user)

            return { code: 200, body: createdUser}
        } catch (error) {
            if(error instanceof AuthError) return { code: 400, body: { message: error.message } }
            return { code: 400, body: { message: 'Register unexpected error.' } }
        }
    }
}
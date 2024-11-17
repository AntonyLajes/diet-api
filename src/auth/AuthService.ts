import AuthError from "../error/AuthError";
import { UserRepository } from "../user/UserRepository";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export class AuthService {
    constructor(private userRepository: UserRepository) { }

    async register(user: UserDTO) {
        const userExists = await this.userRepository.findByEmail(user.email)
        if (userExists) throw new AuthError('Email already in used by another user.')

        const createdUser = await this.userRepository.register(user)
        return createdUser
    }

    async login(user: UserRequestBodyDTO) {
        const userExists = await this.userRepository.findByEmail(user.email)
        if (!userExists) throw new AuthError('User not found.')

        const isSamePassoword = bcrypt.compareSync(user.password, userExists.password)
        if (!isSamePassoword) throw new AuthError('Invalid password.')

        const token = jwt.sign({ id: userExists.id, email: userExists.email }, "autenticacao-jwt", { expiresIn: '1d' })
        return { token, user: userExists }
    }

    async verifyToken(token: string){
        const decodedToken = jwt.verify(token, "autenticacao-jwt") as { id?: string, email?: string}
        console.log(`decodedToken: ${decodedToken}`)

        if(!decodedToken.email) return undefined

        const user = await this.userRepository.findByEmail(decodedToken.email)
        return user
    }
}
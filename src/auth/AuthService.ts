import AuthError from "../error/AuthError";
import { UserRepository } from "../user/UserRepository";

export class AuthService{
    constructor(private userRepository: UserRepository){}

    async register(user: UserDTO){
        const userExists = await this.userRepository.findByEmail(user.email)
        if(userExists) throw new AuthError('Email already in used by another user.')
        
        const createdUser = await this.userRepository.register(user)
        return createdUser
    }
}
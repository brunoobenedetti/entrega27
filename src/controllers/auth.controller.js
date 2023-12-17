import { createHash, isValidPassword, tokenGenerator } from "../helpers/utils.js";
import UsersService from "../services/users.services.js";
import UsersController from "./users.controller.js";

export default class AuthController {
    static async register(data) {
        const {
            first_name,
            last_name,
            email,
            password
        } = data

        let user = await UsersService.findAll({ email })
        if (user) {
            throw new Error("Usuario ya registrado")
        }
        user = await UsersService.create({
            first_name,
            last_name,
            email,
            password: createHash(password)
        })

        const token = tokenGenerator(user)
        // console.log(user)

        return token;
    }
    static async login(data) {
        // const user = await UsersService.f
        const { email, password } = data
        const user = await UsersService.findAll({ email });
        // console.log("user", user)
        if (!user) {
            throw new Error("Correo o contraseña invalidos")
        }
        const validPassword = isValidPassword(password, user);
        if (!validPassword) {
            throw new Error("Correo o contraseña invalidos")
        }
        const token = tokenGenerator(user)
        return token;
    }

    static async resetPassword(data) {
        const { email, newPassword } = data


        await UsersController.updatePassword(email, newPassword)
    }
}
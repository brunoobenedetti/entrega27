import { Router } from 'express';
import 'dotenv/config';
// import UserManager from '../../dao/UserManager.js';
import UsersController from '../../controllers/users.controller.js';

import {
    createHash, isValidPassword,
    jwtAuth, tokenGenerator,
    verifyToken, authMiddleware
} from '../../helpers/utils.js'
import passport from 'passport';

const router = Router();


// aca va auth adelante de cada ruta
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // console.log('entrando a login ahora con jwt')
    try {
        const user = await UsersController.getByMail(email)
        if (!user) {
            return res.status(401).json({ message: "Correo o password invalidos" })
        }
        const isPassValid = isValidPassword(password, user)
        if (!isPassValid) {
            return res.status(401).json({ message: "Correo o password invalidos" })
        }

        const token = tokenGenerator(user);
        // console.log('paso por aca')
        // res.status(200).json({ access_token: token })
        res
            .cookie('access_token', token, { maxAge: 300000, httpOnly: true })
            .status(200)
            .json({ status: 'success' })
    } catch (error) {
        console.log(`Error ${error.message}`);
        return res.status(500).json({ error: error.message })
    }
})

router.get('/current',
    // jwtAuth,
    authMiddleware('jwt'), // aca le mando la estrategia que quiero usar, en este caso jwt
    async (req, res) => {
        // console.log(req.user);
        try {
            // console.log("req.user", req.user)
            res.status(200).json(req.user)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    })

export default router;
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import multer from "multer";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
// import 'dotenv/config';
import passport from "passport";
import UserManager from "../dao/UserManager.js";

import config from "../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ajustar el __dirname para que apunte al directorio 'src/utils'
const srcDir = dirname(__dirname);
const utilsDir = path.join(srcDir, 'utils');

export { __filename, __dirname, utilsDir };


export const getNewId = () => uuidv4();

const existFile = async (path) => {
    try {
        await fs.promises.access(path);
        return true;
    } catch (error) {
        return false;
    }
};

export const getJSONFromFile = async (path) => {
    if (!(await existFile(path))) {
        return [];
    }

    let content;

    try {
        content = await fs.promises.readFile(path, "utf-8");
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser leido.`);
    }

    try {
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`El archivo ${path} no tiene un formato JSON válido.`);
    }
};

export const saveJSONToFile = async (path, data) => {
    // console.log(path, data)
    // return
    const content = JSON.stringify(data, null, "\t");
    try {
        await fs.promises.writeFile(path, content, "utf-8");
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser escrito.`);
    }
};

export class Exception extends Error {
    constructor(message, status) {
        super(message);
        this.statusCode = status;
    }
};

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const pathFile = path.join(__dirname, '../../public/productImages');
//         cb(null, pathFile);
//     },
//     filename: (req, file, cb) => {
//         const filename = `${Date.now()}-${file.originalname}`;
//         cb(null, filename)
//     }
// })


// const storage = multer.diskStorage({
//     destination: './public/productImages',
//     filename: (req, file, cb) => {
//         console.log(file)
//         const filename = file.path;
//         cb(null, filename);
//     }
// });

const storage = multer.diskStorage({
    destination: './public/productImages',
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename.replace(/\\/g, "/")); // Reemplazar barras invertidas con barras normales
    }
});

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (plainPasswordFromLogin, user) => {
    return bcrypt.compareSync(plainPasswordFromLogin, user.password)
}

export const uploader = multer({ storage })

const JWT_SECRET = config.jwtSecret;
export const tokenGenerator = (user) => {
    const { _id, first_name, last_name, email } = user

    const payload = {
        id: _id,
        first_name,
        last_name,
        email
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' }) //
    return token;

}

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                return reject(error);
            }
            resolve(payload)
        })
    })
}

// middleware de autorizacion
export const jwtAuth = (req, res, next) => {
    // aca authorization va en minuscula pese a que en el header viene en mayuscula
    const { authorization: token /*renombrado a token */ } = req.headers; // busca en la cabecera el token y se guarda en authorization
    if (!token) {
        return res.status(401).json({ message: 'unauthorized' })
    }
    jwt.verify(token, JWT_SECRET, async (error, payload) => {
        if (error) {
            return res.status(403).json({ message: 'no authorized' })
        }
        req.user = await UserManager.getById(payload.id)
        next();
    })
}

export const authMiddleware = (strategy) => (req, res, next) => { // funcion que retorna otra funcion (clousure)
    passport.authenticate(strategy, function (error, user, info) {
        if (error) {
            return next(error);
        }
        if (!user) {
            return res.status(401).json({ message: info.message ? info.message : info.toString() }) // info.message trae la informacion de error
        }
        req.user = user;
        next();
    })(req, res, next) // la respuesta de la funcion authenticate no es mas que el middleware ara la siguiente
}
import {validate} from "../middlewares/validate.js";
import express from "express";
import {authSchema} from "../schemas/auth.js";
import {authController} from "../controllers/authController.js";
import {auth} from "../middlewares/auth.js";

const router = express.Router()

export const authRoute = () => {
    router.post('/', validate(authSchema), authController.login);
    router.put('/', authController.refreshAuthentication);
    router.delete('/', auth, authController.logout);

    return router;
}
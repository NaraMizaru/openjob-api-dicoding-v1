import {validate} from "../middlewares/validate.js";
import {userSchema} from "../schemas/users.js";
import {userController} from "../controllers/userController.js";
import express from "express";

const router = express.Router()

export const userRoute = () => {
    router.post('/', validate(userSchema), userController.register);
    router.get('/:id', userController.getUserById);

    return router;
}
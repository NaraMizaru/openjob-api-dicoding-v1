import {validate} from "../middlewares/validate.js";
import express from "express";
import {auth} from "../middlewares/auth.js";
import {categorySchema} from "../schemas/category.js";
import {categoryController} from "../controllers/categoryController.js";

const router = express.Router()

export const categoryRoute = () => {
    router.post('/', auth, validate(categorySchema), categoryController.create)
    router.put('/:id', auth, validate(categorySchema), categoryController.update)
    router.delete('/:id', auth, categoryController.drop)
    router.get('/', categoryController.findAll)
    router.get('/:id', categoryController.findOne)

    return router;
}
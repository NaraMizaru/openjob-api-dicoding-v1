import {validate} from "../middlewares/validate.js";
import express from "express";
import {companySchema} from "../schemas/company.js";
import {companyController} from "../controllers/companyController.js";
import {auth} from "../middlewares/auth.js";

const router = express.Router()

export const companyRoute = () => {
    router.post('/', auth, validate(companySchema), companyController.create)
    router.put('/:id', auth, validate(companySchema), companyController.update)
    router.delete('/:id', auth, companyController.drop)
    router.get('/', companyController.findAll)
    router.get('/:id', companyController.findOne)

    return router;
}
import express from "express";
import {validate} from "../middlewares/validate.js";
import {applicationSchema} from "../schemas/application.js";
import {applicationController} from "../controllers/applicationController.js";
import {auth} from "../middlewares/auth.js";

const router = express.Router();

export const applicationRoute = () => {
    router.post("/", auth, validate(applicationSchema), applicationController.create);
    router.put("/:id", auth, validate(applicationSchema), applicationController.update);
    router.delete("/:id", auth, applicationController.drop);
    router.get("/", applicationController.findAll);
    router.get("/user/:userId", applicationController.findByUser);
    router.get("/job/:jobId", applicationController.findByJob);
    router.get("/:id", applicationController.findOne);

    return router;
};
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
    router.get("/", auth, applicationController.findAll);
    router.get("/user/:userId", auth, applicationController.findByUser);
    router.get("/job/:jobId", auth, applicationController.findByJob);
    router.get("/:id", auth, applicationController.findOne);

    return router;
};
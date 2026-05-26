import express from "express";
import { validate } from "../middlewares/validate.js";
import {jobSchema} from "../schemas/job.js";
import { jobController } from "../controllers/jobController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

export const jobRoute = () => {
  router.post("/", auth, validate(jobSchema), jobController.create);
  router.put("/:id", auth, validate(jobSchema), jobController.update);
  router.delete("/:id", auth, jobController.drop);

  router.get("/", jobController.findAll);
  router.get("/company/:companyId", jobController.findByCompany);
  router.get("/category/:categoryId", jobController.findByCategory);
  router.get("/:id", jobController.findOne);

  return router;
};
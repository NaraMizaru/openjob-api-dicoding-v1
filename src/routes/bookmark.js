import express from "express";
import { bookmarkController } from "../controllers/bookmarkController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

export const bookmarkRoute = () => {
  router.post("/jobs/:jobId/bookmark", auth, bookmarkController.create);
  router.get("/jobs/:jobId/bookmark/:id", auth, bookmarkController.findOne);
  router.delete("/jobs/:jobId/bookmark", auth, bookmarkController.drop);
  router.get("/bookmarks", auth, bookmarkController.findAllByUser);

  return router;
};
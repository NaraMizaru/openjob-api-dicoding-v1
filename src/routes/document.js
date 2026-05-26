import express from "express";
import multer from "multer";
import { auth } from "../middlewares/auth.js";
import { documentController } from "../controllers/documentController.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

export const documentRoute = () => {
  router.get("/", auth, documentController.findAll);

  router.get("/:id", auth, documentController.findOne);

  router.post(
    "/",
    auth,
    upload.single("document"),
    documentController.upload
  );

  router.delete("/:id", auth, documentController.drop);

  return router;
};
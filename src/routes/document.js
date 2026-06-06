import express from "express";
import multer from "multer";
import path from "path";
import { auth } from "../middlewares/auth.js";
import { documentController } from "../controllers/documentController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export const documentRoute = () => {
  router.get("/", auth, documentController.findAll);

  router.get("/:id/file", auth, documentController.serveFile);

  router.get("/:id", auth, documentController.findOne);

  router.post(
    "/",
    auth,
    (req, res, next) => {
      upload.single("document")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              status: "failed",
              message: "File size exceeds the 5 MB limit",
            });
          }
          return res.status(400).json({
            status: "failed",
            message: err.message,
          });
        } else if (err) {
          return res.status(400).json({
            status: "failed",
            message: err.message,
          });
        }
        next();
      });
    },
    documentController.upload,
  );

  router.delete("/:id", auth, documentController.drop);

  return router;
};

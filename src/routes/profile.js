import express from "express";
import {auth} from "../middlewares/auth.js";
import {profileController} from "../controllers/profileController.js";

const router = express.Router();

export const profileRoute = () => {
    router.get("/", auth, profileController.getProfile);
    router.get("/applications", auth, profileController.getMyApplications);
    router.get("/bookmarks", auth, profileController.getMyBookmarks);

    return router;
};
import express from "express";
import userController from "../controllers/user-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import {apiKeyMiddleware} from "../middleware/api-key-middleware.js";
import contentController from "../controllers/content-controller.js";

const userRouter = new express.Router();
userRouter.get("/api/users/current", authMiddleware, userController.get);
userRouter.patch("/api/users/current", authMiddleware, userController.update);
userRouter.delete("/api/users/logout", authMiddleware, userController.logout);

const contentRouter = new express.Router();
contentRouter.post("/api/contents", apiKeyMiddleware, contentController.add);

export {
    userRouter,
    contentRouter
}
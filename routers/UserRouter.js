import { Router } from "express";
import userController from "../controllers/UserController.js";
import { validateToken } from "./middlewares.js";

export function userRouter(mailer) {

    const userRouter = Router();
    
    userRouter.post("/register", async function (req, res) {
        return await userController.register(req, res);
    });
    
    userRouter.post("/login", async function (req, res) {
        return await userController.login(req, res, mailer); 
    });
    
    userRouter.put("/edit", validateToken, async function (req, res) {
        return await userController.editUser(req, res); 
    });
    
    userRouter.delete("/delete", validateToken, async function (req, res) {
        return await userController.deleteUser(req, res); 
    });

    return userRouter;
}
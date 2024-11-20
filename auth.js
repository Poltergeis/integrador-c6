import { Router } from "express";
import { validateToken } from "./routers/middlewares.js";

const authRouter = Router();

authRouter.get('/', validateToken, async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'user is authenticated'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying token or user authentication',
            error: error.message
        });
    }
});

export default authRouter;
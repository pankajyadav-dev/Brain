import Router, { type Request, type Response } from 'express';
import { userSignin, userSignup, createContent } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
export const userRouter = Router();

userRouter.get("/test", (req: Request, res: Response): void => {
    res.json({ message: "api is working properly" });
})

userRouter.post("/signup", userSignup);
userRouter.post("/signin", userSignin);
userRouter.post("/create", authMiddleware, createContent);
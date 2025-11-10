import { Router, type Request, type Response } from "express";
import { createCategory } from "../controllers/categoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const categoryRouter = Router();

categoryRouter.get('/test', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'category api is working'
    });
});
categoryRouter.post('/create', authMiddleware, createCategory);
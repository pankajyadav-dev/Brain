import { Router, type Request, type Response } from "express";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../controllers/categoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const categoryRouter = Router();

categoryRouter.get('/test', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'category api is working'
    });
});
categoryRouter.post('/create', authMiddleware, createCategory);
categoryRouter.get('/', authMiddleware, getCategory);
categoryRouter.patch('/:categoryId', authMiddleware, updateCategory);
categoryRouter.delete('/:categoryId', authMiddleware, deleteCategory);
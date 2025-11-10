import Router, { type Request, type Response } from 'express';
import { createContent, deleteContent, getContent, updateContent } from '../controllers/contentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const contentRouter = Router();

contentRouter.get("/test", (req: Request, res: Response) => {
    res.status(400).json({
        message: "content router is working"
    })
})
contentRouter.post("/:categoryId", authMiddleware, createContent);
contentRouter.get('/:categoryId', authMiddleware, getContent);
contentRouter.delete('/:categoryId/:contentId', authMiddleware, deleteContent);
contentRouter.patch('/:categoryId/:contentId', authMiddleware, updateContent);
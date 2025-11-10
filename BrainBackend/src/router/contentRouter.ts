import Router, { type Request, type Response } from 'express';
import { createContent } from '../controllers/contentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const contentRouter = Router();

contentRouter.get("/test", (req: Request, res: Response) => {
    res.status(400).json({
        message: "content router is working"
    })
})

contentRouter.post("/create", authMiddleware, createContent);

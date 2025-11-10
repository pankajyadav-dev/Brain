import { contentModel, ZContenSchema, type ZContent } from "../model/contentModel.js";
import type { Request, Response } from "express";
import type { ZJwtPayload } from "../config/jwt.js";
import type { IResponse } from "../index.js";
import { verifyTag } from "./tagController.js";

export const createContent = async (req: Request<{}, {}, ZContent> & { userData?: ZJwtPayload }, res: Response<IResponse>): Promise<void> => {
    try {
        if (!req.userData) {
            res.status(400).json({
                message: " Invalid user",
            })
            return;
        }
        req.body.user = req.userData._id;
        const parsedContent = ZContenSchema.safeParse(req.body);
        if (!parsedContent.success) {
            const formattederror = parsedContent.error.issues.map((err) => ({
                field: err.path.join("."),
                message: err.message
            }));
            res.status(411).json({
                message: "Invalid input for content creation",
                error: formattederror
            });
            return;
        }
        await verifyTag(parsedContent.data.tags.map(tag => ({ tagname: tag })));
        await contentModel.create(parsedContent.data);
        res.status(200).json({ message: "content created successfully" });
    } catch (err) {
        if (err instanceof Error) {
            res.status(403).json({ message: `error in creating content ${err}` });
        } else {
            res.status(500).json({ message: `unknow error occur in creating content ${err}` });
        }
    }
} 
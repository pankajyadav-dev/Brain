import { contentModel, ZContenSchema, ZObjectId, type ZContent } from "../model/contentModel.js";
import type { Request, Response } from "express";
import type { ZJwtPayload } from "../config/jwt.js";
import type { IResponse } from "../index.js";
import { verifyTag } from "./tagController.js";
import z from "zod";
import { MongooseError } from "mongoose";

export const ZCategoryParamsSchema = z.object({
    categoryId: ZObjectId
})
export type ZcontentResponce = Omit<ZContent, 'category'> & { _id: z.infer<typeof ZObjectId> }
export type ZCategoryParams = z.infer<typeof ZCategoryParamsSchema>;
export const ZContentPartialSchema = ZContenSchema.partial();
export type ZContentPartial = z.infer<typeof ZContentPartialSchema>;
export const createContent = async (req: Request<ZCategoryParams, {}, ZContent>, res: Response<IResponse>): Promise<void> => {
    try {
        if (!req.params.categoryId) {
            res.status(400).json({
                message: " Invalid category id",
            })
            return;
        }
        req.body.category = req.params.categoryId;
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
export const getContent = async (req: Request<ZCategoryParams, {}, {}>, res: Response<{ data?: ZcontentResponce[] } | IResponse>): Promise<void> => {
    try {
        if (!req.params.categoryId) {
            res.status(400).json({
                message: "invalid category id"
            });
            return;
        }
        const contentData = await contentModel.find({ category: req.params.categoryId }).lean<ZcontentResponce[]>();
        if (!contentData) {
            res.status(200).json({
                message: "No data Available",
            })
            return;
        }
        res.status(200).json({
            message: "data fetch succesfully",
            data: contentData
        })

    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(403).json({
                message: `error in the getcontent route ${err}`,
            })
        } else {
            res.status(500).json({
                message: `unknown error in server in getcontent route ${err}`
            })
        }
    }
}
export const deleteContent = async (req: Request<ZCategoryParams & { contentId: z.infer<typeof ZObjectId> }, {}, {}>, res: Response<IResponse>): Promise<void> => {
    try {
        if (!req.params.categoryId || !req.params.contentId) {
            res.status(400).json({
                message: "Invalid id input",
            });
            return;
        }
        const deleteStatus = await contentModel.findOneAndDelete({ _id: req.params.contentId, category: req.params.categoryId });
        if (!deleteStatus) {
            res.status(403).json({
                message: "No content exist invlaid access"
            });
            return;
        }
        res.status(200).json({
            message: "content deleted successfully"
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(411).json({
                message: `error occured in deleteconten ${err}`
            });
        } else {
            res.status(500).json({
                message: `server error occured in deleteconten ${err}`
            });
        }
    }
}
export const updateContent = async (req: Request<ZCategoryParams & { contentId: z.infer<typeof ZObjectId> }, {}, ZContentPartial>, res: Response<IResponse>): Promise<void> => {
    try {
        if (!req.params.categoryId || !req.params.contentId) {
            res.status(400).json({
                message: "Invalid Input of content Id"
            });
            return;
        }
        const parsedUpdate = ZContentPartialSchema.safeParse(req.body);
        if (!parsedUpdate.success) {
            res.status(400).json({
                message: "Invalid update input data"
            });
            return;
        }
        const updateStatus = await contentModel.findOneAndUpdate(
            { _id: req.params.contentId, category: req.params.categoryId },
            { $set: parsedUpdate.data }, { new: true, runValidators: true }
        ).lean<ZContent | null>();
        if (!updateStatus) {
            res.status(411).json({
                message: "error in the content updation"
            });
            return;
        }
        res.status(200).json({
            message: "update sucessfull"
        })
    } catch (err: unknown) {
        if (err instanceof MongooseError) {
            res.status(411).json({
                message: `Error in update in mongodb ${err}`
            });
        } else if (err instanceof Error) {
            res.status(403).json({
                message: `Error in update  ${err}`
            });
        } else {
            res.status(500).json({
                message: `server Error in update  ${err}`
            });
        }
    }
}
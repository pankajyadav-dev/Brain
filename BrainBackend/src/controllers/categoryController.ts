import type { Request, Response } from "express";
import { ZJwtPayloadSchema, type ZJwtPayload } from "../config/jwt.js";
import { ZodValidationError, type IResponse } from "../index.js";
import { categoryModel, type ZCategory, type ZCategoryResponse, ZcategorySchema, ZCategoryUpdateSchema } from "../model/categoryModel.js";
import { ZCategoryParamsSchema, type ZCategoryParams } from "./contentController.js";
import { MongooseError } from "mongoose";
import { Types } from "mongoose";

//userData comes from middleware authmiddleware
export const createCategory = async (req: Request<{}, {}, ZCategory> & { userData?: ZJwtPayload }, res: Response<IResponse>): Promise<void> => {
    try {
        if (!req.userData) {
            res.status(404).json({
                message: "Invalid User"
            });
        }
        if (req.userData && '_id' in req.userData) {
            req.body.user = req.userData._id;
        }
        const parseRequest = ZcategorySchema.safeParse(req.body);
        if (!parseRequest.success) {
            const formattedError = parseRequest.error.issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message
            }));
            res.status(411).json({
                message: "Invalid category input data",
                error: formattedError
            });
            return;
        }
        await categoryModel.create(parseRequest.data);
        res.status(202).json({
            message: "category created successfully"
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(403).json({
                message: `error occured in create category ${err}`,
            })
        } else {
            res.status(500).json({
                message: `unknown error occured  ${err}`,
            })
        }
    }
}
export const getCategory = async (req: Request & { userData?: ZJwtPayload }, res: Response<{ data?: ZCategoryResponse } | IResponse>): Promise<void> => {
    try {
        if (!req.userData) {
            res.status(404).json({
                message: 'invalid user'
            });
            return;
        }
        const parseUser = ZJwtPayloadSchema.safeParse(req.userData);
        if (!parseUser.success) {
            const formattedError = parseUser.error.issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message
            }))
            res.status(411).json({
                message: 'invalid user input',
                error: formattedError
            });
            return;
        }
        const categoryData = await categoryModel.find({ user: parseUser.data._id }).lean<ZCategoryResponse>();
        res.status(200).json({
            message: "category get request",
            data: categoryData
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(403).json({
                message: `error in getcontent ${err}`
            });
        } else {
            res.status(403).json({
                message: `error in getcontent ${err}`
            });
        }
    }
}
export const updateCategory = async (req: Request<ZCategoryParams, {}, Pick<ZCategory, 'categoryName'>> & { userData?: ZJwtPayload }, res: Response<IResponse>): Promise<void> => {
    try {
        if (!req.userData || !req.userData._id) {
            res.status(404).json({
                message: "not valid user"
            });
            return;
        }
        if (!req.params.categoryId || !Types.ObjectId.isValid(req.params.categoryId)) {
            res.status(404).json({
                message: 'not a valid category ID'
            });
            return;
        }
        const parseCategory = ZCategoryUpdateSchema.safeParse(req.body);
        if (!parseCategory.success) {
            res.status(400).json({
                message: "Invalid category update data",
                error: ZodValidationError(parseCategory.error)
            });
            return;
        }
        const updateStatus = await categoryModel.findOneAndUpdate(
            { _id: req.params.categoryId, user: req.userData._id },
            { $set: parseCategory.data },
            { new: true, runValidators: true }
        ).lean<ZCategory>();

        if (!updateStatus) {
            res.status(400).json({
                message: "No category found",
            });
            return;
        }
        res.status(200).json({
            message: 'successfully update the category'
        })
    } catch (err: unknown) {
        if (err instanceof MongooseError) {
            res.status(411).json({
                message: `database error in update category ${err}`
            });
        } else if (err instanceof Error) {
            res.status(411).json({
                message: `error in update category ${err}`
            });
        } else {
            res.status(411).json({
                message: `server error in update category ${err}`
            });
        }
    }
}
export const deleteCategory = async (req: Request<ZCategoryParams, {}, {}> & { userData?: ZJwtPayload }, res: Response<IResponse>): Promise<void> => {
    try {
        if (!req.params.categoryId || !Types.ObjectId.isValid(req.params.categoryId)) {
            res.status(404).json({
                message: "invalid category id"
            });
            return;
        }
        if (!req.userData || !req.userData._id) {
            res.status(404).json({
                message: "invalid user"
            });
            return;
        }
        const deleteStatus = await categoryModel.findOneAndDelete(
            { _id: req.params.categoryId, user: req.userData._id }
        )
        if (!deleteStatus) {
            res.status(400).json({
                message: "category not ofund"
            });
            return;
        }
        res.status(200).json({
            message: "category deleted successfully"
        });
    } catch (err: unknown) {
        if (err instanceof MongooseError) {
            res.status(411).json({
                message: `database error in update category ${err}`
            });
        } else if (err instanceof Error) {
            res.status(411).json({
                message: `error in update category ${err}`
            });
        } else {
            res.status(411).json({
                message: `server error in update category ${err}`
            });
        }
    }
}
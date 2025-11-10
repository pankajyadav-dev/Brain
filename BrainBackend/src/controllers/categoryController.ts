import type { Request, Response } from "express";
import type { ZJwtPayload } from "../config/jwt.js";
import type { IResponse } from "../index.js";
import { categoryModel, type ZCategory, ZcategorySchema } from "../model/categoryModel.js";

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
        console.log(err);
    }
}
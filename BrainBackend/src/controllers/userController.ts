import type { Request, Response } from "express";
import { userModel, ZUserSchema, type ZIUser, type ZIUserSingin, ZUserSinginSchema, type IUser } from "../model/userModel.js";
import type { IResponse } from "../index.js";
import { generateToken, ZJwtPayloadSchema, type ZJwtPayload } from "../config/jwt.js";
import { contentModel, ZContenSchema, type ZContent } from "../model/contentModel.js";
import { verifyTag } from "./tagController.js";
import argon2 from "argon2";
export const userSignup = async (req: Request<{}, {}, ZIUser>, res: Response<IResponse>): Promise<void> => {
    try {
        const result = ZUserSchema.safeParse(req.body);
        if (!result.success) {
            const formattedErrors = result.error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            res.status(400).json({
                message: "Validation failed",
                error: formattedErrors,
            });
            return;
        }
        const hashpassword = await argon2.hash(result.data.password);
        result.data.password = hashpassword;
        await userModel.create(result.data);
        res.status(200).json({
            message: "user signup successfully"
        });
    } catch (err) {
        if (err instanceof Error) {
            res.status(403).json({
                message: `user Already exise ${err.message}`
            })
        } else {
            res.status(500).json({
                message: `The unknow error occursed server failed ${err}`
            });
        }
    }
}

export const userSignin = async (req: Request<{}, {}, ZIUserSingin>, res: Response<IResponse>): Promise<void> => {
    try {
        const result = ZUserSinginSchema.safeParse(req.body);
        if (!result.success) {
            const formattedErrors = result.error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            res.status(411).json({
                message: "Validation failed",
                error: formattedErrors
            });
            return;
        }
        const userData = await userModel.findOne({ email: result.data.email }).lean<IUser & { _id: string }>();
        if (userData && "password" in userData && await argon2.verify(userData.password, result.data.password)) {
            const tokenpayload = ZJwtPayloadSchema.safeParse({
                _id: userData._id.toString(),
                username: userData.username
            });
            if (!tokenpayload.success) {
                res.status(500).json({ message: "server failed to generate token" });
                return;
            }
            const NewToken = generateToken(tokenpayload.data);
            if (NewToken) {
                res.status(200).json({
                    message: "user signed in successfully",
                    token: NewToken
                })
                return;
            }
            res.status(500).json({
                message: "user signed in Failed"
            })
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(403).json({
                message: `user Already exise ${err.message}`
            })
        } else {
            res.status(500).json({
                message: `The unknow error occursed server failed ${err}`
            });
        }
    }
}


export const createContent = async (req: Request<{}, {}, ZContent> & { userData?: ZJwtPayload }, res: Response<IResponse>): Promise<void> => {
    try {
        if (!req.userData) {
            res.status(401).json({
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
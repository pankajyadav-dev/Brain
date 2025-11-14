import type { Request, Response } from "express";
import { userModel, ZUserSchema, type ZIUser, type ZIUserSingin, ZUserSinginSchema, type IUser, type ZIUpdateUser, ZUpdateUserSchema } from "../model/userModel.js";
import { type IResponse, ZodValidationError } from "../index.js";
import { generateToken, ZJwtPayloadSchema, type ZJwtPayload } from "../config/jwt.js";
import argon2 from "argon2";
import { contentModel } from "../model/contentModel.js";
import { MongooseError } from "mongoose";

export const userSignup = async (req: Request<{}, {}, ZIUser>, res: Response<IResponse>): Promise<void> => {
    try {
        const result = ZUserSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Validation failed",
                error: ZodValidationError(result.error)
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
            res.status(405).json({
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
            res.status(411).json({
                message: "Validation failed",
                error: ZodValidationError(result.error)
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
                res.status(503).json({
                    message: "not valid user data in jwtpayload",
                    error: ZodValidationError(tokenpayload.error)
                });
                return;
            }
            const NewToken = generateToken(tokenpayload.data);
            if (!NewToken) {
                res.status(500).json({
                    message: "user signed in Failed"
                })
                return;
            }
            res.status(200).json({
                message: "user signed in successfully",
                token: NewToken
            })
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(403).json({
                message: `failed to singin user ${err.message}`
            })
        } else {
            res.status(500).json({
                message: `The unknow error occursed server failed ${err}`
            });
        }
    }
}

export const deleteUser = async (req: Request & { userData?: ZJwtPayload }, res: Response<IResponse>): Promise<void> => {
    try {
        const userid = ZJwtPayloadSchema.safeParse(req.userData);
        if (!userid.success) {
            res.status(401).json({
                message: "Invalid user",
                error: ZodValidationError(userid.error)
            });
            return;
        }
        const deletestatus = await userModel.findByIdAndDelete(userid.data._id);
        if (!deletestatus) {
            res.status(411).json({
                message: "user doesnot exist",
            })
            return;
        }
        await contentModel.deleteMany({ user: userid.data._id });
        res.status(200).json({
            message: " user deleted successfully",
        })
    } catch (err) {
        if (err instanceof Error) {
            res.status(403).json({
                message: `Invalid user error ${err}`,
            })
        } else {
            res.status(500).json({
                message: ` error in server ${err}`,
            })
        }
    }
}

export const updateUser = async (req: Request<{}, {}, ZIUpdateUser> & { userData?: ZJwtPayload }, res: Response<IResponse>): Promise<void> => {
    try {
        //check if the req have user data include the user id
        if (!req.userData || !req.userData._id) {
            res.status(400).json({
                message: "invlaid user"
            });
            return;
        }
        const checkUser = ZJwtPayloadSchema.safeParse(req.userData);
        //check the user id is valid object id or not 
        if (!checkUser.success) {
            res.status(401).json({
                message: "not vlaid user update data",
                error: ZodValidationError(checkUser.error)
            });
            return;
        }
        //check is the update data input are valid and correct
        const updateData = ZUpdateUserSchema.safeParse(req.body);
        if (!updateData.success) {
            res.status(401).json({
                message: "not vlaid user update data",
                error: ZodValidationError(updateData.error)
            });
            return;
        }
        //hash the password if user want to update the password in update request
        if (updateData.data.password) {
            const hashpassword = await argon2.hash(updateData.data.password);
            updateData.data.password = hashpassword;
        }
        //update the database with update user data 
        const updateStatus = await userModel.findByIdAndUpdate(req.userData._id, { $set: updateData.data });
        if (!updateStatus) {
            res.status(400).json({
                message: "not a valid user to update database"
            });
            return;
        }
        // successfuly status
        res.status(200).json({
            message: "user update successful"
        });
    } catch (err: unknown) {
        //return if database have any error in during update
        if (err instanceof MongooseError) {
            res.status(411).json({
                message: `error in database update ${err}`
            });
        } else if (err instanceof Error) {
            //return if any error during update
            res.status(411).json({
                message: `error in user update ${err}`
            });
        } else {
            //return if any error  in server during update
            res.status(500).json({
                message: `server error in the user update ${err}`
            });
        }
    }
}
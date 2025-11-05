import type { NextFunction, Request, Response } from "express";
import { verifyToken, type ZJwtPayload } from "../config/jwt.js";

export const authMiddleware = async (req: Request & { userData?: ZJwtPayload }, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authtoken = req.headers?.authorization;
        if (!authtoken || typeof authtoken !== 'string') {
            res.status(401).json({
                message: "Invlaid user no authtoken",
            })
            return;
        }
        const authData = verifyToken(authtoken);
        req.userData = authData;
        next();
        return;
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(401).json({
                message: `error in user verified ${err}`
            })
        } else {
            res.status(500).json({
                message: "unknown error in authmiddleware"
            })
        }
    }
}
import jwt from 'jsonwebtoken';
import z from 'zod';
import { JWT_SECRET } from './config.js';


export const ZJwtPayloadSchema = z.object({
    _id: z.string().min(1, "user Id is required"),
    username: z.string().min(3, "name should be greater then length 3")
})
export const ZTokenPayloadSchema = z.string().min(1, "token is required");
export type ZTokenPayload = z.infer<typeof ZTokenPayloadSchema>;
export type ZJwtPayload = z.infer<typeof ZJwtPayloadSchema>
export const generateToken = (data: ZJwtPayload): string => {
    try {
        const result = ZJwtPayloadSchema.safeParse(data);
        if (!result.success) {
            throw new Error("failed to sign jwt");
        }
        const token = jwt.sign(result.data, JWT_SECRET, {
            expiresIn: "1d",
            algorithm: "HS256",
        });
        return token;
    } catch (err) {
        throw new Error("Invalid user data");
    }
}

export const verifyToken = (token: ZTokenPayload): ZJwtPayload => {
    try {
        const authtoken = ZTokenPayloadSchema.safeParse(token);
        if (!authtoken.success) {
            throw new Error("Invalid token");
        }
        const authData = jwt.verify(authtoken.data, JWT_SECRET, {
            algorithms: ["HS256"],
            ignoreExpiration: false,
        })
        const verifiedData = ZJwtPayloadSchema.safeParse(authData);
        if (!verifiedData.success) {
            throw new Error("Invalid Token");
        }
        return verifiedData.data;
    } catch (err: unknown) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new Error("token expired");
        } else if (err instanceof jwt.JsonWebTokenError) {
            throw new Error("Invalid Token");
        } else {
            throw new Error("Unknown error in token verifing");
        }
    }
}


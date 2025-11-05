import { Schema, model, Model, type InferSchemaType } from "mongoose";
import z from "zod";

export const ZUserSchema = z.object({
    username: z.string().min(3, "name should be greater then length 3").max(25, "name should be less then length 25"),
    email: z.string().email("Not valid email address"),
    password: z.string().min(6, "password should be greater then length 6")
})
export const ZUserSinginSchema = ZUserSchema.pick({
    email: true,
    password: true
})
export type ZIUser = z.infer<typeof ZUserSchema>;
export type ZIUserSingin = z.infer<typeof ZUserSinginSchema>;
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

export type IUser = InferSchemaType<typeof userSchema>;
export type typeUserModel = Model<IUser>;
export const userModel: typeUserModel = model<IUser>("users", userSchema);
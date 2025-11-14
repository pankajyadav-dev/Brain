import { z } from "zod";
import type { ClientResponse, IResponse } from "../types/api";
import { api, ZodValidationError } from "./axiosInstance";




export const ZUserSchema = z.object({
    username: z.string().min(3, "name should be greater then length 3").max(25, "name should be less then length 25"),
    email: z.email("Not valid email address"),
    password: z.string().min(6, "password should be greater then length 6")
})
export type ZIUser = z.infer<typeof ZUserSchema>;
export const ZSignin = z.object({
    email: z.email("invalid email address"),
    password: z.string().min(6, "invalid password")
})
export type ZSignin = z.infer<typeof ZSignin>;

export const signin = async (userData: ZSignin): Promise<ClientResponse> => {
    try {
        const parseUser = ZSignin.safeParse(userData);
        if (!parseUser.success) {
            return {
                success: false,
                message: "Invalid input",
                error: ZodValidationError(parseUser.error)
            }
        }
        const ApiResponse = await api.post<IResponse>('/user/signin', parseUser.data);
        if (!ApiResponse.status) {
            return {
                success: false,
                message: "Invalid credentials",
                error: ApiResponse.data.error
            }
        }
        console.log(ApiResponse.data.token);
        return {
            success: true,
            message: "user signin successfully"
        }
    } catch (err: any) {
        return {
            success: false,
            message: err.response?.data?.message || err?.message,
            error: err.response?.data?.message
        }
    }

}

export const signup = async (userData: ZIUser): Promise<ClientResponse> => {
    try {
        const parseUser = ZUserSchema.safeParse(userData);
        if (!parseUser.success) {
            return {
                success: false,
                message: "invalid input",
                error: ZodValidationError(parseUser.error)
            }
        }
        const ApiResponse = await api.post<IResponse>('/user/signup', parseUser.data);
        if (!ApiResponse.status) {
            return {
                success: false,
                message: "invalid input",
                error: ApiResponse.data.error
            }
        }
        console.log(ApiResponse);

        return {
            success: true,
            message: ApiResponse.data.message
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.response?.data?.error || err.message,
            error: err.response?.data?.error
        }
    }
};

import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { API_BASEURL } from '../config/config';
import { z } from 'zod';
export const ZodValidationError = (error: z.ZodError): {
    field: string,
    message: string,
}[] => {
    return error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message
    }));
}



export const api = axios.create({
    baseURL: API_BASEURL,
    timeout: 10000, // 10 seconds - more reasonable for API calls
    timeoutErrorMessage: "request timeout",
});


api.interceptors.request.use((req: InternalAxiosRequestConfig) => {
    const authToken: string | null = localStorage.getItem("AuthToken");
    if (authToken && req.headers) {
        req.headers.Authorization = authToken;
    }
    return req;
},
    (error: AxiosError) => {
        console.error(`error in request interceptor ${error}`);
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (content: AxiosResponse) => content,
    (error: AxiosError) => {
        console.error(`error in the response interceptor ${error}`);
        return Promise.reject(error);
    }
);
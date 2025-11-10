import express from 'express';
import morgan from 'morgan';
import { userRouter } from './router/userRouter.js';
import { contentRouter } from './router/contentRouter.js';
import { ConnectDB } from './config/mongo.js';
import { PORT } from './config/config.js';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
const app = express();

export type IResponse = {
    message: string,
    token?: string,
    error?: string[] | { field: string, message: string }[]
}
export const ZuserParamsSchema = z.object({
    id: z.string().min(1, "user id is required").max(24, "invalid user id param")
});
export type ZUserParams = z.infer<typeof ZuserParamsSchema>
app.use(express.json());
app.use(morgan('dev'));
app.use("/api/user", userRouter);
// app.use("/api/content", contentRouter);


//handle error if the req.bodyu have invlaid json 
app.use((err: Error, req: Request, res: Response<IResponse>, next: NextFunction): void => {
    if (err instanceof SyntaxError && "body" in req) {
        res.status(401).json({
            message: "Invalid json in body",
        })
        return;
    }
    res.status(500).json({
        message: err.message || " internal error in server"
    })
})
try {
    await ConnectDB();
    app.listen(PORT, (): void => {
        console.log(`api is running on ${PORT}`);
    })
} catch (err) {
    if (err instanceof Error) {
        console.log(`error occured ${err}`);
    } else {
        console.log(`unknown error occured ${err}`);
    }
    process.exit(1);
}

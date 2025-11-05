import express from 'express';
import morgan from 'morgan';
import { userRouter } from './router/userRouter.js';
import { ConnectDB } from './config/mongo.js';
import { PORT } from './config/config.js';
const app = express();

export type IResponse = {
    message: string,
    token?: string,
    error?: string[] | { field: string, message: string }[]
}
app.use(express.json());
app.use(morgan('dev'));

app.use("/api/user", userRouter);

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

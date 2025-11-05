import mongoose from 'mongoose';
import { MONGO_URI } from './config.js';

// const MONGOURI: string = MONGO_URI as string;
export const ConnectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000
        });
        console.log("mongo db is connected successfully");
    } catch (err) {
        if (err instanceof Error) {
            console.log(`error occured ${err}`);
        } else {
            console.log(`unknown error occured ${err}`);
        }
        process.exit(1);
    }
}
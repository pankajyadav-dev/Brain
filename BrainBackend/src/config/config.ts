import dotenv from 'dotenv';
dotenv.config();

export const PORT: string = process.env.PORT || "3000";
export const JWT_SECRET: string = process.env.JWT_SECRET || "secondbrain";
export const MONGO_URI: string = process.env.MONGO_URI || "mongodb://virat:virat123@localhost:27017/BrainApp?authSource=admin";
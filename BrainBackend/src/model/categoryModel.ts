import { Schema, model, type InferSchemaType } from "mongoose";
import { ZObjectId } from "./contentModel.js";
import { string, z } from 'zod';

export type ZCategoryResponse = {
    _id: string,
    categoryName: string,
}

export const ZcategorySchema = z.object({
    categoryName: z.string().min(1, 'category name is required').max(50, 'category name should be less than 50'),
    user: ZObjectId
})
export const ZCategoryUpdateSchema = z.object({
    categoryName: z.string().min(1, 'category name is required').max(50, 'category name should be less than 50')
})
export type ZCategory = z.infer<typeof ZcategorySchema>;
const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
}, { timestamps: true });

categorySchema.index({ categoryName: 1, user: 1 }, { unique: true });
export type ICategory = InferSchemaType<typeof categorySchema>;
export const categoryModel = model<ICategory>('Categories', categorySchema);
import { Schema, model, type InferSchemaType } from 'mongoose';
import { z } from 'zod';

export const ZTagSchema = z.object({
    tagname: z.string().min(1, "tag name is required").max(100, "Tag name should be less then length 100")
});
export type ZTag = z.infer<typeof ZTagSchema>;
const tagSchema = new Schema({
    tagname: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true
})
export type ITag = InferSchemaType<typeof tagSchema>;
export const tagModel = model<ITag>("Tags", tagSchema);
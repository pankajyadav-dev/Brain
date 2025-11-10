import mongoose, { Schema, model, type InferSchemaType } from 'mongoose';
import { z } from 'zod';

export enum typeEnum {
    document = "document",
    tweet = "tweet",
    youtube = "youtube",
    link = "link"
}
export const ZTypeEnum = z.enum(["document", "tweet", "youtube", "link"]);
export const ZObjectId = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), "Invlaid Object Id");
export const ZContenSchema = z.object({
    type: ZTypeEnum,
    link: z.url(),
    title: z.string().min(1, "title is required").max(100, "title should be less than length 100"),
    description: z.string().min(1, "description is required").max(300, "description length should be less than 300"),
    user: ZObjectId,
    tags: z.array(z.string()).nonempty("add atleast the one tag in the content")
})
export type ZContent = z.infer<typeof ZContenSchema>;
const contentSchema = new Schema({
    type: {
        type: String,
        enum: ["document", "tweet", "youtube", "link"],
        required: true
    },
    link: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Categories",
        required: true
    },
    tags: {
        type: [String],
        required: true
    }
}, {
    timestamps: true
});

export type IContent = InferSchemaType<typeof contentSchema>;
export const contentModel = model<IContent>("Contents", contentSchema);
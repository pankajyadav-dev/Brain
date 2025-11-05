import { tagModel, type ZTag } from "../model/tagModel.js";


export const verifyTag = async (tagsArray: ZTag[]): Promise<void> => {
    try {
        const existingtag = await tagModel.find(
            { tagname: { $in: tagsArray.map((t) => t.tagname) } }
        );
        const existingtagname: string[] = existingtag.map(
            (tag) => tag.tagname
        );
        const newTag = tagsArray.filter(
            (tag: ZTag) => !existingtagname.includes(tag.tagname)
        );
        await tagModel.insertMany(
            newTag.map(
                (tag) => ({ tagname: tag.tagname })),
            { ordered: false }
        );
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error(`error in tags creation ${err}`);
        } else {
            throw new Error("Unknown error in the tag verification");
        }
    }
} 
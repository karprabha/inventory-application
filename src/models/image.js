import { Schema, model } from "mongoose";

const ImageSchema = new Schema({
    data: {
        type: Buffer,
        required: true,
        validate: [
            {
                validator(value) {
                    return value.length <= 40 * 1024;
                },
                message: "Image size exceeds the limit (40KB)",
            },
        ],
    },
    contentType: {
        type: String,
        required: true,
    },
});

const Image = model("Image", ImageSchema);

export default Image;

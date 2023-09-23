import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    name: { type: String, required: true, minLength: 1, maxLength: 100 },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 200,
    },
});

// eslint-disable-next-line func-names
CategorySchema.virtual("url").get(function () {
    // eslint-disable-next-line no-underscore-dangle
    return `/inventory/category/${this._id}`;
});

const Category = model("Category", CategorySchema);

export default Category;

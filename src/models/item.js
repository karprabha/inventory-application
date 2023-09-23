import { Schema, model } from "mongoose";

const ItemSchema = new Schema({
    name: { type: String, required: true, minLength: 1, maxLength: 100 },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 200,
    },
    category: { type: Schema.Types.ObjectId, required: true },
    price: { type: Number, required: true, min: 0, max: 1000 },
    numberInStock: { type: Number, required: true, min: 0, max: 10000 },
});

// eslint-disable-next-line func-names
ItemSchema.virtual("url").get(function () {
    // eslint-disable-next-line no-underscore-dangle
    return `/item/${this._id}`;
});

const Item = model("Item", ItemSchema);

export default Item;

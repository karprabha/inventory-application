/* eslint-disable camelcase */
import expressAsyncHandler from "express-async-handler";
import Item from "../models/item.js";
import Category from "../models/category.js";

export const index = expressAsyncHandler(async (req, res, next) => {
    const [numItems, numCategories] = await Promise.all([
        Item.countDocuments({}).exec(),
        Category.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "Inventory",
        item_count: numItems,
        category_count: numCategories,
    });
});

export const item_list = expressAsyncHandler(async (req, res, next) => {
    const allItems = await Item.find({}, "name category")
        .sort({ name: 1 })
        .populate("category")
        .exec();

    res.render("item_list", { title: "Item List", item_list: allItems });
});

// eslint-disable-next-line consistent-return
export const item_detail = expressAsyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("category").exec();

    if (item === null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_detail", {
        title: item.name,
        // eslint-disable-next-line object-shorthand
        item: item,
    });
});

export const item_create_get = expressAsyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item create GET");
});

export const item_create_post = expressAsyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item create POST");
});

export const item_delete_get = expressAsyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item delete GET");
});

export const item_delete_post = expressAsyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item delete POST");
});

export const item_update_get = expressAsyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item update GET");
});

export const item_update_post = expressAsyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item update POST");
});

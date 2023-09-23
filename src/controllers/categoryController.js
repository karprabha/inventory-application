/* eslint-disable camelcase */
import expressAsyncHandler from "express-async-handler";
import Category from "../models/category.js";
import Item from "../models/item.js";

export const category_list = expressAsyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, "name")
        .sort({ name: 1 })
        .exec();

    res.render("category_list", {
        title: "Category List",
        category_list: allCategories,
    });
});

// eslint-disable-next-line consistent-return
export const category_detail = expressAsyncHandler(async (req, res, next) => {
    const [category, itemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "name description").exec(),
    ]);

    if (category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_detail", {
        title: category.name,
        // eslint-disable-next-line object-shorthand
        category: category,
        category_items: itemsInCategory,
    });
});

export const category_create_get = expressAsyncHandler(
    async (req, res, next) => {
        res.send("NOT IMPLEMENTED: Category create GET");
    }
);

export const category_create_post = expressAsyncHandler(
    async (req, res, next) => {
        res.send("NOT IMPLEMENTED: Category create POST");
    }
);

export const category_delete_get = expressAsyncHandler(
    async (req, res, next) => {
        res.send("NOT IMPLEMENTED: Category delete GET");
    }
);

export const category_delete_post = expressAsyncHandler(
    async (req, res, next) => {
        res.send("NOT IMPLEMENTED: Category delete POST");
    }
);

export const category_update_get = expressAsyncHandler(
    async (req, res, next) => {
        res.send("NOT IMPLEMENTED: Category update GET");
    }
);

export const category_update_post = expressAsyncHandler(
    async (req, res, next) => {
        res.send("NOT IMPLEMENTED: Category update POST");
    }
);

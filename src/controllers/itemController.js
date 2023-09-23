/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
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

export const item_detail = expressAsyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("category").exec();

    if (item === null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_detail", {
        title: item.name,
        item: item,
    });
});

export const item_create_get = expressAsyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().exec();

    res.render("item_form", {
        title: "Create Item",
        categories: allCategories,
    });
});

export const item_create_post = [
    body("name", "Item name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description", "Item description must contain at least 10 characters")
        .trim()
        .isLength({ min: 10 })
        .escape(),
    body("category", "Item category must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("price", "Item price must be between 0-1000")
        .trim()
        .isFloat({ min: 0, max: 1000 })
        .escape(),
    body("numberInStock", "Item numberInStock must be between 0-1000")
        .trim()
        .isFloat({ min: 0, max: 1000 })
        .escape(),

    expressAsyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const item = await Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
        });

        if (!errors.isEmpty()) {
            const allCategories = await Category.find().exec();

            res.render("item_form", {
                title: "Create Item",
                categories: allCategories,
                item: item,
                errors: errors.array(),
            });
        } else {
            await item.save();
            res.redirect(item.url);
        }
    }),
];

export const item_delete_get = expressAsyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("category").exec();

    if (item === null) {
        res.redirect("/inventory/items");
    }

    res.render("item_delete", {
        title: "Delete Item",
        item: item,
    });
});

export const item_delete_post = expressAsyncHandler(async (req, res, next) => {
    await Item.findByIdAndRemove(req.body.id);
    res.redirect("/inventory/items");
});

export const item_update_get = expressAsyncHandler(async (req, res, next) => {
    const [item, allCategories] = await Promise.all([
        Item.findById(req.params.id).populate("category").exec(),
        Category.find().exec(),
    ]);

    if (item === null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_form", {
        title: "Update Item",
        item: item,
        categories: allCategories,
    });
});

export const item_update_post = [
    body("name", "Item name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description", "Item description must contain at least 10 characters")
        .trim()
        .isLength({ min: 10 })
        .escape(),
    body("category", "Item category must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("price", "Item price must be between 0-1000")
        .trim()
        .isFloat({ min: 0, max: 1000 })
        .escape(),
    body("numberInStock", "Item numberInStock must be between 0-1000")
        .trim()
        .isFloat({ min: 0, max: 1000 })
        .escape(),

    expressAsyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const item = await Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            const allCategories = await Category.find().exec();

            res.render("item_form", {
                title: "Create Item",
                categories: allCategories,
                item: item,
                errors: errors.array(),
            });
        } else {
            await Item.findByIdAndUpdate(req.params.id, item);
            res.redirect(item.url);
        }
    }),
];

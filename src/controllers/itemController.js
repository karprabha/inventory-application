/* eslint-disable no-underscore-dangle */
/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import multer from "multer";

import Item from "../models/item.js";
import Image from "../models/image.js";
import Category from "../models/category.js";

const upload = multer();

export const index = expressAsyncHandler(async (req, res, next) => {
    const [numItems, numCategories] = await Promise.all([
        Item.countDocuments({}).exec(),
        Category.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "InstaGrocery",
        item_count: numItems,
        category_count: numCategories,
    });
});

export const item_list = expressAsyncHandler(async (req, res, next) => {
    const allItems = await Item.find({})
        .sort({ name: 1 })
        .populate("category")
        .populate("image")
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
    upload.single("image"),

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

        const imageBuffer = req.file ? req.file.buffer : null;
        const contentType = req.file ? req.file.mimetype : null;
        const imageSize = req.file ? req.file.size : null;

        const maxImageSize = 40 * 1024;
        const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];

        let imgError = null;

        if (imageBuffer === null) {
            imgError = "No image uploaded.";
        } else if (contentType === null) {
            imgError = "Image content type is missing.";
        } else if (imageSize > maxImageSize) {
            imgError = "Image size exceeds the limit (40KB).";
        } else if (!allowedImageTypes.includes(contentType)) {
            imgError = "Unsupported image format.";
        }

        const item = await Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
        });

        if (!errors.isEmpty() || imgError !== null) {
            const allCategories = await Category.find().exec();
            res.render("item_form", {
                title: "Create Item",
                categories: allCategories,
                item: item,
                errors: errors.array(),
                imgError: imgError,
            });
        } else {
            const image = await Image.create({
                data: imageBuffer,
                contentType: contentType,
            });

            item.set("image", image._id);

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
    const item = await Item.findById(req.body.id);
    await Image.findByIdAndRemove(item.image._id);
    await Item.findByIdAndRemove(req.body.id);

    res.redirect("/inventory/items");
});

export const item_update_get = expressAsyncHandler(async (req, res, next) => {
    const [item, allCategories] = await Promise.all([
        Item.findById(req.params.id)
            .populate("category")
            .populate("image")
            .exec(),
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
    upload.single("image"),

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

        const imageBuffer = req.file ? req.file.buffer : null;
        const contentType = req.file ? req.file.mimetype : null;
        const imageSize = req.file ? req.file.size : null;

        const maxImageSize = 40 * 1024;
        const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];

        let imgError = null;

        if (imageBuffer === null) {
            imgError = null;
        } else if (contentType === null) {
            imgError = "Image content type is missing.";
        } else if (imageSize > maxImageSize) {
            imgError = "Image size exceeds the limit (40KB).";
        } else if (!allowedImageTypes.includes(contentType)) {
            imgError = "Unsupported image format.";
        }

        const item = await Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            _id: req.params.id,
        });

        if (!errors.isEmpty() || imgError !== null) {
            const allCategories = await Category.find().exec();

            res.render("item_form", {
                title: "Create Item",
                categories: allCategories,
                item: item,
                errors: errors.array(),
                imgError: imgError,
            });
        } else {
            if (imageBuffer !== null) {
                const getItem = await Item.findById(req.params.id);

                const image = await Image({
                    data: imageBuffer,
                    contentType: contentType,
                    _id: getItem.image._id,
                });

                await Image.findByIdAndUpdate(getItem.image._id, image);
            }

            await Item.findByIdAndUpdate(req.params.id, item);
            res.redirect(item.url);
        }
    }),
];

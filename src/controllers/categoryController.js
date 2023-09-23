/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
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
        category: category,
        category_items: itemsInCategory,
    });
});

export const category_create_get = (req, res, next) => {
    res.render("category_form", { title: "Create Category" });
};

export const category_create_post = [
    body("name", "Category name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),

    body(
        "description",
        "Category description must contain at least 10 characters"
    )
        .trim()
        .isLength({ min: 10 })
        .escape(),

    expressAsyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
        });

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Create Category",
                category: category,
                errors: errors.array(),
            });
            // eslint-disable-next-line no-useless-return
            return;
            // eslint-disable-next-line no-else-return
        } else {
            const categoryExists = await Category.findOne({
                name: req.body.name,
            })
                .collation({ locale: "en", strength: 2 })
                .exec();

            if (categoryExists) {
                res.redirect(categoryExists.url);
            } else {
                await category.save();
                res.redirect(category.url);
            }
        }
    }),
];

export const category_delete_get = expressAsyncHandler(
    async (req, res, next) => {
        const [category, itemsInCategory] = await Promise.all([
            Category.findById(req.params.id).exec(),
            Item.find({ category: req.params.id }, "name description").exec(),
        ]);

        if (category === null) {
            res.redirect("/inventory/categories");
        }

        res.render("category_delete", {
            title: "Delete Category",
            category: category,
            category_items: itemsInCategory,
        });
    }
);

export const category_delete_post = expressAsyncHandler(
    async (req, res, next) => {
        const [category, itemsInCategory] = await Promise.all([
            Category.findById(req.params.id).exec(),
            Item.find({ category: req.params.id }, "name description").exec(),
        ]);

        if (itemsInCategory.length > 0) {
            res.render("category_delete", {
                title: "Delete Category",
                category: category,
                category_items: itemsInCategory,
            });
            // eslint-disable-next-line no-useless-return
            return;
            // eslint-disable-next-line no-else-return
        } else {
            await Category.findByIdAndRemove(req.body.id);
            res.redirect("/inventory/categories");
        }
    }
);

export const category_update_get = expressAsyncHandler(
    async (req, res, next) => {
        const category = await Category.findById(req.params.id).exec();

        if (category === null) {
            const err = new Error("Category not found");
            err.status = 404;
            return next(err);
        }

        res.render("category_form", {
            title: "Update Category",
            category: category,
        });
    }
);

export const category_update_post = [
    body("name", "Category name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),

    body(
        "description",
        "Category description must contain at least 10 characters"
    )
        .trim()
        .isLength({ min: 10 })
        .escape(),

    expressAsyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Update Category",
                category: category,
                errors: errors.array(),
            });
            // eslint-disable-next-line no-useless-return
            return;
            // eslint-disable-next-line no-else-return
        } else {
            await Category.findByIdAndUpdate(req.params.id, category);
            res.redirect(category.url);
        }
    }),
];

/* eslint-disable camelcase */
import expressAsyncHandler from "express-async-handler";
import Category from "../models/category.js";

export const category_list = expressAsyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category list");
});

export const category_detail = expressAsyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Category Detail: ${req.params.id}`);
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

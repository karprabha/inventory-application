/* eslint-disable camelcase */
import expressAsyncHandler from "express-async-handler";
import Item from "../models/item.js";
import Category from "../models/category.js";

export const index = expressAsyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Site Home Page");
});

export const item_list = expressAsyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item list");
});

export const item_detail = expressAsyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Item Detail: ${req.params.id}`);
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

import expressAsyncHandler from "express-async-handler";
import Item from "../models/item.js";

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

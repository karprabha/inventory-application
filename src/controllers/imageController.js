/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
import expressAsyncHandler from "express-async-handler";
import Image from "../models/image.js";

// eslint-disable-next-line import/prefer-default-export
export const image_detail = expressAsyncHandler(async (req, res, next) => {
    const image = await Image.findById(req.params.id);

    if (image === null) {
        const err = new Error("Image not found");
        err.status = 404;
        return next(err);
    }

    res.contentType(image.contentType);
    res.send(image.data);
});

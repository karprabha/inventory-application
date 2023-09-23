/* eslint-disable camelcase */
import { Router } from "express";
import * as item_controller from "../controllers/itemController.js";
import * as category_controller from "../controllers/categoryController.js";

const router = Router();

/// ITEM ROUTES ///
router.get("/", item_controller.index);

router.get("/item", item_controller.item_create_get);

router.post("/item", item_controller.item_create_post);

router.get("/item", item_controller.item_delete_get);

router.post("/item", item_controller.item_delete_post);

router.get("/item", item_controller.item_update_get);

router.post("/item", item_controller.item_update_post);

router.get("/item/:id", item_controller.item_detail);

router.get("/items", item_controller.item_list);

/// CATEGORY ROUTES ///

router.get("/category", category_controller.category_create_get);

router.post("/category", category_controller.category_create_post);

router.get("/category", category_controller.category_delete_get);

router.post("/category", category_controller.category_delete_post);

router.get("/category", category_controller.category_update_get);

router.post("/category", category_controller.category_update_post);

router.get("/category/:id", category_controller.category_detail);

router.get("/categories", category_controller.category_list);

export default router;

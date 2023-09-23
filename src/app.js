import logger from "morgan";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import createError from "http-errors";
import mongoose from "mongoose";
// eslint-disable-next-line import/no-extraneous-dependencies
import { config } from "dotenv";
import databaseConfig from "./config/database.js";

import indexRouter from "./routes/index.js";
import inventoryRouter from "./routes/inventory.js";

config();

const app = express();
// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

mongoose.set("strictQuery", false);
const env = process.env.NODE_ENV || "development";
const dbConfig = databaseConfig[env];

try {
    await mongoose.connect(dbConfig.url, dbConfig.options);
    // eslint-disable-next-line no-console
    console.log("Connected to MongoDB");
} catch (err) {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", err);
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/inventory", inventoryRouter);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
});

export default app;

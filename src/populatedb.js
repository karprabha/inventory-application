#! /usr/bin/env node
/* eslint-disable no-console */

import mongoose from "mongoose";
import Item from "./models/item.js";
import Image from "./models/image.js";
import Category from "./models/category.js";

const items = [];
const categories = [];

const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];

mongoose.set("strictQuery", false);

function generateDummyImage() {
    const width = 100;
    const height = 100;
    const channels = 4;
    const imageSize = width * height * channels;
    const dummyImage = Buffer.alloc(imageSize);

    for (let i = 0; i < imageSize; i += channels) {
        dummyImage.writeUInt8(255, i);
        dummyImage.writeUInt8(255, i + 1);
        dummyImage.writeUInt8(255, i + 2);
        dummyImage.writeUInt8(255, i + 3);
    }

    return dummyImage;
}

async function categoryCreate(index, name, description) {
    const category = new Category({ name, description });
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
}

async function itemCreate(
    index,
    name,
    description,
    category,
    price,
    numberInStock
) {
    const dummyImage = new Image({
        data: generateDummyImage(),
        contentType: "image/jpeg",
    });

    await dummyImage.save();

    const itemdetail = {
        name,
        description,
        category,
        price,
        numberInStock,
        // eslint-disable-next-line no-underscore-dangle
        image: dummyImage._id,
    };

    const item = new Item(itemdetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
}

async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
        categoryCreate(
            0,
            "Fruits",
            "Fresh and delicious fruits for a healthy diet."
        ),
        categoryCreate(
            1,
            "Vegetables",
            "A wide variety of farm-fresh vegetables to choose from."
        ),
        categoryCreate(
            2,
            "Dairy",
            "Dairy products including milk, cheese, and yogurt."
        ),
        categoryCreate(
            3,
            "Canned Goods",
            "Convenient canned goods for your pantry needs."
        ),
    ]);
}

async function createItems() {
    console.log("Adding Items");
    await Promise.all([
        itemCreate(
            0,
            "Apple",
            "Fresh and crisp apples for a healthy snack.",
            categories[0],
            0.5,
            100
        ),
        itemCreate(
            1,
            "Banana",
            "Sweet and ripe bananas, perfect for a quick energy boost.",
            categories[0],
            0.25,
            150
        ),
        itemCreate(
            2,
            "Carrot",
            "Nutritious and crunchy carrots, great for salads and snacks.",
            categories[1],
            0.3,
            80
        ),
        itemCreate(
            3,
            "Broccoli",
            "Fresh broccoli florets, packed with vitamins and minerals.",
            categories[1],
            0.75,
            60
        ),
        itemCreate(
            4,
            "Milk",
            "Full-fat cow's milk, perfect for your morning cereal.",
            categories[2],
            2.0,
            40
        ),
        itemCreate(
            5,
            "Cheese",
            "Creamy cheddar cheese, ideal for sandwiches and snacks.",
            categories[2],
            1.5,
            30
        ),
        itemCreate(
            6,
            "Canned Tomatoes",
            "Canned diced tomatoes for making sauces and soups.",
            categories[3],
            1.0,
            50
        ),
        itemCreate(
            7,
            "Canned Tuna",
            "Flaky canned tuna, a versatile ingredient for salads and sandwiches.",
            categories[3],
            1.75,
            20
        ),
    ]);
}

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

main().catch((err) => console.log(err));

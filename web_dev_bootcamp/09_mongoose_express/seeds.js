// Just for dev purposes, create some data in the database

const mongoose = require("mongoose");
const Product = require("./models/product");
mongoose
    .connect("mongodb://localhost:27017/farmStand")
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
    })
    .catch((error) => {
        console.log("OH NO, MONGO CONNECTION ERROR!!!");
        console.log(error);
    });

// clear the database before we do anything with it
Product.deleteMany({}, function (err) {
    console.log("ALL PRODUCTS DROPPED!!!");
    // and then add initial data
    const seedProducts = [
        {
            name: "Ruby Grapefruit",
            price: 1.99,
            category: "fruit",
        },
        {
            name: "Fairy Eggplant",
            price: 1.0,
            category: "vegetable",
        },
        {
            name: "Organic Goddess Melon",
            price: 4.99,
            category: "fruit",
        },
        {
            name: "Organic Mini Seedless Watermelon",
            price: 3.99,
            category: "fruit",
        },
        {
            name: "Organic Celery",
            price: 1.5,
            category: "vegetable",
        },
        {
            name: "Chocolate Whole Milk",
            price: 2.69,
            category: "dairy",
        },
    ];

    Product.insertMany(seedProducts)
        .then((response) => {
            console.log("DATABASE SEEDED!");
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
});

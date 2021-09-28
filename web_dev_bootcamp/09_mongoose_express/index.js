const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./models/product");
const methodOverride = require("method-override");

mongoose
    .connect("mongodb://localhost:27017/farmStand")
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
    })
    .catch((error) => {
        console.log("OH NO, MONGO CONNECTION ERROR!!!");
        console.log(error);
    });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const categories = Product.schema.path("category").enumValues;
const allCategories = "All";

app.get("/products", async (request, response) => {
    let { category } = request.query;
    let categoryDisplay;

    if (category) {
        categoryDisplay = category;
    } else {
        category = categories;
        categoryDisplay = allCategories;
    }
    const products = await Product.find({ category: category });
    response.render("products/index", { products, categoryDisplay, allCategories });
});

app.get("/products/new", (request, response) => {
    response.render("products/new", { categories });
});

app.post("/products", async (request, response) => {
    // not a good way to do it, just for simplicity
    // beware of validations, we have no error handling!
    // const newProduct = new Product(request.body, { runValidators: true });
    const newProduct = new Product(request.body);
    await newProduct.save();
    response.redirect(`/products/${newProduct._id}`);
});

app.get("/products/:id", async (request, response) => {
    const { id } = request.params;
    const product = await Product.findById(id);
    response.render("products/show", { product });
});

app.get("/products/:id/edit", async (request, response) => {
    const { id } = request.params;
    const product = await Product.findById(id);
    response.render("products/edit", { product, categories });
});

app.put("/products/:id", async (request, response) => {
    const { id } = request.params;
    // not a good way to do it, just for simplicity
    // beware of validations, we have no error handling!
    // const product = await Product.findByIdAndUpdate(id, request.body, { runValidators: true, new: true });
    const product = await Product.findByIdAndUpdate(id, request.body, { new: true });
    response.redirect(`/products/${product._id}`);
});

app.delete("/products/:id", async (request, response) => {
    const { id } = request.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    response.redirect("/products");
});

app.listen((port = 3000), () => {
    console.log(`LISTENING ON PORT ${port}`);
});

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (request, response) => {
    response.render("home");
});

app.get("/campgrounds", async (request, response) => {
    const campgrounds = await Campground.find({});
    response.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/:id", async (request, response) => {
    const id = request.params.id;
    const campground = await Campground.findById(id);
    response.render("campgrounds/show", { campground });
});

app.listen(3000, () => {
    console.log("Serving on port 3000");
});

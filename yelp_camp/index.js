const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const morgan = require("morgan");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (request, response) => {
    response.render("home");
});

// list route
app.get("/campgrounds", async (request, response) => {
    const campgrounds = await Campground.find({});
    response.render("campgrounds/index", { campgrounds });
});

// new route
// has to be before show route, otherwise we hit the show route first and the "new" is treated as an id
app.get("/campgrounds/new", (request, response) => {
    response.render("campgrounds/new");
});

app.post("/campgrounds", async (request, response) => {
    const campground = new Campground(request.body.campground);
    await campground.save();
    response.redirect(`/campgrounds/${campground._id}`);
});

// show route
app.get("/campgrounds/:id", async (request, response) => {
    const id = request.params.id;
    const campground = await Campground.findById(id);
    response.render("campgrounds/show", { campground });
});

// edit route
app.get("/campgrounds/:id/edit", async (request, response) => {
    const id = request.params.id;
    const campground = await Campground.findById(id);
    response.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (request, response) => {
    const { id } = request.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...request.body.campground });
    response.redirect(`/campgrounds/${campground._id}`);
});

// delete route
app.delete("/campgrounds/:id", async (request, response) => {
    const { id } = request.params;
    await Campground.findByIdAndDelete(id);
    response.redirect("/campgrounds/");
});

app.listen(3000, () => {
    console.log("Serving on port 3000");
});

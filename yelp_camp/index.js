const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const { prependListener } = require("process");
const AppError = require("./appError");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (request, response) => {
    response.render("home");
});

// list route
app.get("/campgrounds", async (request, response, next) => {
    try {
        const campgrounds = await Campground.find({});
        response.render("campgrounds/index", { campgrounds });
    } catch (error) {
        // the error has to be passed in next() call in async function instead of throwing it
        next(error);
    }
});

// new route
// has to be before show route, otherwise we hit the show route first and the "new" is treated as an id
app.get("/campgrounds/new", (request, response) => {
    response.render("campgrounds/new");
});

app.post("/campgrounds", async (request, response, next) => {
    try {
        const campground = new Campground(request.body.campground);
        await campground.save();
        response.redirect(`/campgrounds/${campground._id}`);
    } catch (error) {
        // the error has to be passed in next() call in async function instead of throwing it
        next(error);
    }
});

// show route
app.get("/campgrounds/:id", async (request, response, next) => {
    try {
        const id = request.params.id;
        const campground = await Campground.findById(id);
        if (!campground) {
            // error thrown in a try block will be handled in the catch block
            throw new AppError("CAMPGROUND NOT FOUND", 404);
        } else {
            response.render("campgrounds/show", { campground });
        }
    } catch (error) {
        // the error has to be passed in next() call in async function instead of throwing it
        next(error);
    }
});

// edit route
app.get("/campgrounds/:id/edit", async (request, response, next) => {
    try {
        const id = request.params.id;
        const campground = await Campground.findById(id);
        if (!campground) {
            // error thrown in a try block will be handled in the catch block
            throw new AppError("CAMPGROUND NOT FOUND", 404);
        } else {
            response.render("campgrounds/edit", { campground });
        }
    } catch (error) {
        // the error has to be passed in next() call in async function instead of throwing it
        next(error);
    }
});

app.put("/campgrounds/:id", async (request, response, next) => {
    try {
        const { id } = request.params;
        const campground = await Campground.findByIdAndUpdate(
            id,
            { ...request.body.campground },
            { runValidators: true }
        );
        response.redirect(`/campgrounds/${campground._id}`);
    } catch (error) {
        // the error has to be passed in next() call in async function instead of throwing it
        next(error);
    }
});

// delete route
app.delete("/campgrounds/:id", async (request, response, next) => {
    try {
        const { id } = request.params;
        await Campground.findByIdAndDelete(id);
        response.redirect("/campgrounds/");
    } catch (error) {
        // the error has to be passed in next() call in async function instead of throwing it
        next(error);
    }
});

// for testing only
app.get("/error", (request, response) => {
    throw new AppError("NOT ALLOWED!", 401);
});

// error handling
app.use((error, request, response, next) => {
    const { status = 500, message = "Something went wrong!" } = error;
    response.status(status).send(message);
});

app.listen(3000, () => {
    console.log("Serving on port 3000");
});

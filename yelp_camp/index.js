const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");

const Campground = require("./models/campground");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");
const validateCampground = require("./utils/validateCampground");

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
app.get(
    "/campgrounds",
    wrapAsync(async (request, response, next) => {
        const campgrounds = await Campground.find({});
        response.render("campgrounds/index", { campgrounds });
    })
);

// new route
// has to be before show route, otherwise we hit the show route first and the "new" is treated as an id
app.get("/campgrounds/new", (request, response) => {
    response.render("campgrounds/new");
});

app.post(
    "/campgrounds",
    validateCampground,
    wrapAsync(async (request, response, next) => {
        const campground = new Campground(request.body.campground);
        await campground.save();
        response.redirect(`/campgrounds/${campground._id}`);
    })
);

// show route
app.get(
    "/campgrounds/:id",
    wrapAsync(async (request, response, next) => {
        const id = request.params.id;
        const campground = await Campground.findById(id);
        if (!campground) {
            // throw the error for wrapAsync() function to handle it
            throw new ExpressError("CAMPGROUND NOT FOUND", 404);
        } else {
            response.render("campgrounds/show", { campground });
        }
    })
);

// edit route
app.get(
    "/campgrounds/:id/edit",
    wrapAsync(async (request, response, next) => {
        const id = request.params.id;
        const campground = await Campground.findById(id);
        if (!campground) {
            // throw the error for wrapAsync() function to handle it
            throw new ExpressError("CAMPGROUND NOT FOUND", 404);
        } else {
            response.render("campgrounds/edit", { campground });
        }
    })
);

app.put(
    "/campgrounds/:id",
    validateCampground,
    wrapAsync(async (request, response, next) => {
        const { id } = request.params;
        const campground = await Campground.findByIdAndUpdate(
            id,
            { ...request.body.campground },
            { runValidators: true }
        );
        response.redirect(`/campgrounds/${campground._id}`);
    })
);

// delete route
app.delete(
    "/campgrounds/:id",
    wrapAsync(async (request, response, next) => {
        const { id } = request.params;
        await Campground.findByIdAndDelete(id);
        response.redirect("/campgrounds/");
    })
);

// catch-all 404
app.all("*", (request, response, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// error handling
app.use((error, request, response, next) => {
    const { statusCode = 500, message = "Something went wrong!", stack } = error;
    response.status(statusCode).render("error", { message, stack });
});

app.listen(3000, () => {
    console.log("Serving on port 3000");
});

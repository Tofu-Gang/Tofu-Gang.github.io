const mongoose = require("mongoose");
mongoose
    .connect("mongodb://localhost:27017/shopApp")
    .then(() => {
        console.log("CONNECTION OPEN!!!");
    })
    .catch((error) => {
        console.log("OH NO, ERROR!!!");
        console.log(error);
    });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 20,
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be positive ya dodo!"], // custom error message
    },
    onSale: {
        type: Boolean,
        default: false,
    },
    categories: {
        type: [String],
        default: ["Cycling"],
    },
    quantity: {
        online: {
            type: Number,
            default: 0,
        },
        inStore: {
            type: Number,
            default: 0,
        },
    },
    size: {
        type: String,
        enum: ["S", "M", "L"],
    },
});

// ############################################################################
// instance methods

productSchema.methods.greet = function () {
    console.log("HELLO!!! HI!!! HOWDY!!!");
    console.log(`- from ${this.name}`);
};

productSchema.methods.toggleOnSale = function () {
    this.onSale = !this.onSale;
    return this.save();
};

productSchema.methods.addCategory = function (newCategory) {
    this.categories.push(newCategory);
    return this.save();
};

// ############################################################################
// static methods

productSchema.statics.fireSale = function () {
    return this.updateMany({}, { onSale: true, price: 0 });
};

// ############################################################################

const Product = mongoose.model("Product", productSchema);
Product.deleteMany({}, function (error) {
    console.log("ALL PRODUCTS DROPPED!!!");

    newBike();
    // newBikeHelmet(Product);
    // newBikeHelmetLongName(Product);
    // newBikeHelmetNegPrice(Product);
    // newAndUpdateTirePump(Product);
    // newCyclingJersey(Product);
});

// ############################################################################

function newBike() {
    const bike = new Product({
        name: "Mountain Bike",
        price: 599,
        // price: "599", // will be cast to integer 599
        // price: "hello!", // error, cannot be cast to integer
        // color: "red", // will just be ignored, color is not part of the schema
        categories: ["Cycling", "Safety"],
    });

    bike.save()
        .then(async (response) => {
            console.log("BIKE SAVE WORKED!!!");
            console.log(response);
            bike.greet();
            await bike.toggleOnSale();
            console.log("AFTER TOGGLE ON SALE");
            console.log(bike);
            await bike.addCategory("Outdoors");
            console.log("AFTER ADD CATEGORY");
            console.log(bike);
            Product.fireSale().then((response) => console.log("AFTER FIRE SALE\n", response));
        })
        .catch((error) => {
            console.log("OH NO, ERROR!!!");
            console.log(error);
        });
}

// ############################################################################

function newBikeHelmet(model) {
    const bikeHelmet = new model({
        name: "Bike Helmet",
        // name: "Bike Helmet From Helmet Makers", // too long name
        price: 29.5,
        // price: -29.5, // negative price not allowed
    });
    bikeHelmet
        .save()
        .then((response) => {
            console.log("BIKE HELMET SAVE WORKED!!!");
            console.log(response);
        })
        .catch((error) => {
            console.log("OH NO, ERROR!!!");
            console.log(error);
        });
}

// ############################################################################

function newAndUpdateTirePump(model) {
    const tirePump = new model({
        name: "Tire Pump",
        price: 19.5,
    });
    tirePump
        .save()
        .then((response) => {
            console.log("TIRE PUMP SAVE WORKED!!!");
            console.log(response);

            // update completely disregards schema by default, therefore runValidators: true
            model
                .findOneAndUpdate({ name: "Tire Pump" }, { price: -10.99 }, { new: true, runValidators: true })
                .then((response) => {
                    console.log("TIRE PUMP UPDATE NEG PRICE WORKED!!!");
                    console.log(response);
                })
                .catch((error) => {
                    console.log("OH NO, ERROR!!!");
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log("OH NO, ERROR!!!");
            console.log(error);
        });
}

// ############################################################################

function newCyclingJersey(model) {
    const cyclingJersey = new model({
        name: "Cycling Jersey",
        price: 28.5,
        size: "XS", // not valid enum value
    });
    cyclingJersey
        .save()
        .then((response) => {
            console.log("CYCLING JERSEY SAVE WORKED!!!");
            console.log(response);
        })
        .catch((error) => {
            console.log("OH NO, ERROR!!!");
            console.log(error);
        });
}

// ############################################################################

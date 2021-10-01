const mongoose = require("mongoose");
// for a reference in other files
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
});

module.exports = mongoose.model("Campground", CampgroundSchema);

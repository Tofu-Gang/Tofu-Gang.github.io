const mongoose = require("mongoose");
// for a reference in other files
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: [true, "Name cannot be blank."],
    },
    price: Number,
    description: String,
    location: {
        type: String,
        required: true,
    },
    image: String,
});

module.exports = mongoose.model("Campground", CampgroundSchema);

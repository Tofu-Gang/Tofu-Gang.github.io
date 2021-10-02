const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const rand = Math.floor(Math.random() * cities.length);
        const city = cities[rand];
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${city.city}, ${city.state}`,
            price: price,
            image: "https://source.unsplash.com/collection/483251",
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur cumque iusto reprehenderit minus earum asperiores sit eligendi aspernatur ipsum suscipit perferendis quam minima, vero recusandae. Autem nesciunt repellat nemo molestias.",
        });
        await camp.save();
    }
};

seedDB().then(() => {
    console.log("Database seeded. Closing the connection...");
    mongoose.connection.close();
});

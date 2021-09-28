const mongoose = require("mongoose");
// connect to the movies database
mongoose
    .connect("mongodb://localhost:27017/movieApp")
    .then(() => {
        console.log("CONNECTION OPEN!!!");
    })
    .catch((error) => {
        console.log("OH NO, ERROR!!!");
        console.log(error);
    });

// connection hopefully established, let's define the movie database schema
const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String,
});

// make a model class from the schema
// string param "Movie" should be singular and capitalized, name of the class should be the same
// collection name will be derived from it, singular and not capitalized
const Movie = mongoose.model("Movie", movieSchema);
// clear the database before we do anything with it
Movie.deleteMany({}, function (err) {
    console.log("ALL MOVIES DROPPED!!!");

    // new instances of a movie, still just on the JS side
    const amadeus = new Movie({ title: "Amadeus", year: 1984, score: 9.2, rating: "R" });

    // ========== CREATE ==========
    // finally insert amadeus and bunch of other movies to the database
    Movie.insertMany([
        amadeus,
        { title: "Amelie", year: 2001, score: 8.3, rating: "R" },
        { title: "Alien", year: 1979, score: 8.1, rating: "R" },
        { title: "The Iron Giant", year: 1999, score: 7.5, rating: "PG" },
        { title: "Stand By Me", year: 1986, score: 8.6, rating: "R" },
        { title: "Moonrise Kingdom", year: 2012, score: 7.3, rating: "PG-13" },
    ])
        .then((data) => {
            console.log("INSERT MANY WORKED!!!");
            console.log(data);

            // ========== READ ==========
            // it is important to do this in the then() of the insertMany() promise, otherwise the movies are not guaranteed to be in the database yet
            // read(Movie);
            // ========== UPDATE ==========
            // update(Movie);
            // ========== DELETE ==========
            // deleteFromModel(Movie);
        })
        .catch((error) => {
            console.log("OH NO, ERROR!!!");
            console.log(error);
        });
});

// ############################################################################

function readModel(model) {
    model.find({}).then((data) => {
        console.log("FIND ALL WORKED!!!");
        console.log(data);
    });

    model.find({ rating: "PG-13" }).then((data) => {
        console.log("FIND ALL PG-13 RATED WORKED!!!");
        console.log(data);
    });

    model.find({ year: { $gte: 2010 } }).then((data) => {
        console.log("FIND ALL SHOT IN 2010 AND NEWER WORKED!!!");
        console.log(data);
    });

    model.find({ year: { $lt: 1990 } }).then((data) => {
        console.log("FIND ALL SHOT IN 1990 AND OLDER WORKED!!!");
        console.log(data);
    });
}

// ############################################################################

function updateModel(model) {
    model.updateMany({ title: { $in: ["Amadeus", "Stand By Me"] } }, { score: 10 }).then((response) => {
        console.log("UPDATE WORKED!!!");
        console.log(response);

        model.find({ title: { $in: ["Amadeus", "Stand By Me"] } }).then((response) => {
            console.log("FIND UPDATE RESULT WORKED!!!");
            console.log(response);
        });
    });
    model.findOneAndUpdate({ title: "The Iron Giant" }, { score: 8.0 }, { new: true }).then((response) => {
        console.log("UPDATE WORKED!!!");
        console.log(response);
        // no need to read the database, the data is returned in "response"
    });
}

// ############################################################################

function deleteFromModel(model) {
    model.deleteOne({ title: "Amelie" }).then((response) => {
        console.log("DELETE WORKED!!!");
        console.log(response);

        model.find({}).then((data) => {
            console.log("FIND ALL WORKED!!!");
            console.log(data);
        });
    });

    model.deleteMany({ year: { $gte: 1999 } }).then((response) => {
        console.log("DELETE WORKED!!!");
        console.log(response);

        model.find({}).then((data) => {
            console.log("FIND ALL WORKED!!!");
            console.log(data);
        });
    });

    model.findOneAndDelete({ title: "Alien" }).then((response) => {
        console.log("DELETE WORKED!!!");
        console.log(response);

        model.find({}).then((data) => {
            console.log("FIND ALL WORKED!!!");
            console.log(data);
        });
    });
}

// ############################################################################

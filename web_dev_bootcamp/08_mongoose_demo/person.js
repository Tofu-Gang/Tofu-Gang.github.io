const mongoose = require("mongoose");
mongoose
    .connect("mongodb://localhost:27017/personApp")
    .then(() => {
        console.log("CONNECTION OPEN!!!");
    })
    .catch((error) => {
        console.log("OH NO, ERROR!!!");
        console.log(error);
    });

const personSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
});

personSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

personSchema.virtual("fullName").set(function (fullName) {
    this.firstName = fullName.substr(0, fullName.indexOf(" "));
    this.lastName = fullName.substr(fullName.indexOf(" ") + 1);
});

personSchema.pre("save", async function () {
    this.firstName = "YO";
    this.lastName = "MAMA";
    console.log("ABOUT TO SAVE!!!");
});

personSchema.post("save", async function () {
    console.log("JUST SAVED!!!");
});

const Person = mongoose.model("Person", personSchema);

const tammy = new Person({ firstName: "Tammy", lastName: "Chow" });
console.log(tammy.fullName);
tammy.fullName = "Tammy Xiao";
console.log(tammy.fullName);

tammy.save();

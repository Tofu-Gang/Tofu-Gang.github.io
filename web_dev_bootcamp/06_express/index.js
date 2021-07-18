const express = require("express");
const path = require("path");
const redditData = require("./data.json");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (request, response) => {
    response.render("home", { name: "home" });
});

app.get("/cats", (request, response) => {
    const cats = ["Šíšena", "Minitaur"];
    response.render("cats", { cats, name: "cats" });
});

app.get("/rand", (request, response) => {
    const num = Math.floor(Math.random() * 10) + 1;
    response.render("random", { rand: num, name: "random" });
});

app.get("/r/:subreddit", (request, response) => {
    const { subreddit } = request.params;
    const data = redditData[subreddit];

    if (data) {
        response.render("subreddit", { ...data });
    } else {
        response.render("notfound", { subreddit, name: "not found" });
    }
});

app.listen((port = 8080), () => {
    console.log(`LISTENING ON PORT ${port}`);
});

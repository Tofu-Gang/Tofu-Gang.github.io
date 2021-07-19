const express = require("express");
const path = require("path");
const { v4: uuid } = require("uuid");
const methodOverride = require("method-override");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

let comments = [
    {
        id: uuid(),
        username: "Todd",
        comment: "lol that is so funny!",
    },
    {
        id: uuid(),
        username: "Skyler",
        comment: "I like to go birdwatching with my dog.",
    },
    {
        id: uuid(),
        username: "Sk8erBoi",
        comment: "Plz delete your account Todd",
    },
    {
        id: uuid(),
        username: "onlysayswoof",
        comment: "woof woof woof",
    },
];

app.get("/comments", (request, response) => {
    response.render("comments/index", { comments });
});

app.get("/comments/new", (request, response) => {
    response.render("comments/new");
});

app.post("/comments", (request, response) => {
    const { username, comment } = request.body;
    comments.push({ username, comment, id: uuid() });
    response.redirect("/comments");
});

app.get("/comments/:id", (request, response) => {
    const { id } = request.params;
    const comment = comments.find((comment) => comment.id === id);
    response.render("comments/show", { comment });
});

app.patch("/comments/:id", (request, response) => {
    const { id } = request.params;
    const comment = comments.find((comment) => comment.id === id);
    comment.comment = request.body.comment;
    response.redirect("/comments");
});

app.get("/comments/:id/edit", (request, response) => {
    const { id } = request.params;
    const comment = comments.find((comment) => comment.id === id);
    response.render("comments/edit", { comment });
});

app.delete("/comments/:id", (request, response) => {
    const { id } = request.params;
    comments = comments.filter((comment) => comment.id !== id);
    response.redirect("/comments");
});

app.listen((port = 8080), () => {
    console.log(`LISTENING ON PORT ${port}`);
});

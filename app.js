const data = require("./data");
const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.engine(
  "hbs",
  expressHandlebars.engine({
    defaultLayout: "main.hbs",
  })
);

app.get("/", function (request, response) {
  const model = {
    humans: data.humans,
  };
  response.render("home.hbs", model);
});

app.get("/posts", function (request, response) {
  const model = {
    posts: data.posts,
  };
  response.render("posts.hbs", model);
});

app.get("/create", function (request, response) {
  const model = {
    posts: data.posts,
  };
  response.render("create.hbs", model);
});

app.post("/create", function (request, response) {
  const contentDate = request.body.contentDate;
  const contentTitle = request.body.contentTitle;
  const content = request.body.content;

  data.posts.unshift({
    postId: data.posts.at(-1).id + 1,
    date: contentDate,
    title: contentTitle,
    content: content,
  });
  response.redirect("/posts");
});

app.get("/contact", function (request, response) {
  const model = {
    contact: data.contact,
  };
  response.render("contact.hbs", model);
});

app.get("/logIn", function (request, response) {
  const model = {
    logIn: data.logIn,
  };
  response.render("logIn.hbs", model);
});

app.listen(8080);

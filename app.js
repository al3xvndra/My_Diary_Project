const data = require("./data");
const express = require("express");
const expressHandlebars = require("express-handlebars");

const app = express();

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

app.use(express.static("public"));

app.listen(8080);

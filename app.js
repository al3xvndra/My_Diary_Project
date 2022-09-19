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

  const newPost = {
    postId: data.posts.length + 1,
    date: contentDate,
    title: contentTitle,
    content: content,
  };

  data.posts.unshift(newPost);
  console.log(data.posts);
  response.redirect("/posts");
});

app.get("/feedback", function (request, response) {
  const model = {
    feedback: data.feedback,
  };
  response.render("feedback.hbs", model);
});

app.post("/contact", function (request, response) {
  const feedbackName = request.body.feedbackName;
  const feedbackEmail = request.body.feedbackEmail;
  const feedback = request.body.feedback;

  const newFeedback = {
    feedbackId: data.feedback.length + 1,
    fName: feedbackName,
    email: feedbackEmail,
    feedback: feedback,
  };

  data.feedback.unshift(newFeedback);
  console.log(data.feedback);
  response.redirect("/feedback");
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

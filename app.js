const data = require("./data");
const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("MyVirtualDiaryDatabase.db");

db.run(
  `CREATE TABLE IF NOT EXISTS posts(
  id INTEGER PRIMARY KEY,
  title TEXT
  success TEXT,
  struggle TEXT, 
  content TEXT)`
);

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
    comments: data.comments,
  };
  response.render("home.hbs", model);
});

app.get("/posts", function (request, response) {
  const query = `SELECT * FROM posts`;

  db.all(query, function (error, posts) {
    const model = {
      posts,
    };
    response.render("posts.hbs", model);
  });
});

app.post("/posts", function (request, response) {
  const commentContent = request.body.comment;

  const newComment = {
    commentId: data.comments.length + 1,
    // postId: data.posts.postId,
    comment: commentContent,
  };

  data.comments.unshift(newComment);
  console.log(data.comments);
  response.redirect("/posts");
});

app.get("/create", function (request, response) {
  const model = {
    posts: data.posts,
  };
  response.render("create.hbs", model);
});

app.post("/create", function (request, response) {
  // const data = request.body.postDate;
  const title = request.body.postTitle;
  const success = request.body.postSuccess;
  const struggle = request.body.postStruggle;
  const content = request.body.postContent;

  const query = `INSERT INTO posts (title, success, struggle, content) VALUES(?, ?, ?, ?)`;

  const values = [title, success, struggle, content];

  db.run(query, values, function (error) {
    response.redirect("/posts");
  });
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
  response.redirect("/thankYou");
});

app.get("/contact", function (request, response) {
  const model = {
    contact: data.contact,
  };
  response.render("contact.hbs", model);
});

app.get("/thankYou", function (request, response) {
  const model = {
    thankYou: data.thankYou,
  };
  response.render("thankYou.hbs", model);
});

app.get("/about", function (request, response) {
  const model = {
    logIn: data.logIn,
  };
  response.render("about.hbs", model);
});

app.get("/logIn", function (request, response) {
  const model = {
    logIn: data.logIn,
  };
  response.render("logIn.hbs", model);
});

app.listen(8080);

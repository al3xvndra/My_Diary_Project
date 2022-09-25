const data = require("./data");
const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("MyVirtualDiaryDatabase.db");
const expressSession = require("express-session");
const adminUsername = "alex";
const adminPassword = "me";

db.run(
  `CREATE TABLE IF NOT EXISTS posts(
  id INTEGER PRIMARY KEY,
  title TEXT,
  success TEXT,
  struggle TEXT, 
  content TEXT)`
);

db.run(
  `CREATE TABLE IF NOT EXISTS feedback(
  id INTEGER PRIMARY KEY,
  name TEXT,
  feedback TEXT,
  email TEXT)`
);

db.run(
  `CREATE TABLE IF NOT EXISTS comments(
    id INTEGER PRIMARY KEY,
    postID INTEGER,
    comment TEXT,
    FOREIGN KEY(postID) REFERENCES posts(id))`
);

const app = express();

app.engine(
  "hbs",
  expressHandlebars.engine({
    defaultLayout: "main.hbs",
  })
);

app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(
  expressSession({
    saveUninitialized: false,
    resave: false,
    secret: "dfhgj",
  })
);

app.use(function (request, response, next) {
  response.locals.session = request.session;
  next();
});

// home page

app.get("/", function (request, response) {
  response.render("home.hbs");
});

// app.get("/posts", function (request, response) {
//   const query = `SELECT * FROM posts`;

//   db.all(query, function (error, posts) {
//     const query = `SELECT * FROM comments`;

//     db.all(query, function (error, comments) {
//       for (const post of posts) {
//         post.comments = comments.filter((c) => c.postID == post.id);
//       }

//       const model = {
//         posts,
//       };
//       response.render("posts.hbs", model);
//     });
//   });
// });

// app.post("/posts/:id", function (request, response) {
//   // const postID = posts.id;
//   const comment = request.body.comment;

//   const query = `INSERT INTO comments (postID, comment) VALUES(?, ?)`;

//   const values = [postID, comment];

//   db.run(query, values, function (error) {
//     response.redirect("/about");
//     console.log("new comment added");
//   });
// });

//posts page

app.get("/posts", function (request, response) {
  const query = `SELECT * FROM posts`;

  db.all(query, function (error, posts) {
    const model = {
      posts,
    };
    response.render("posts.hbs", model);
  });
});

// chosen post page

app.get("/posts/:id", function (request, response) {
  const id = request.params.id;
  const query = `SELECT * FROM posts WHERE id = ?`;
  const values = [id];

  db.get(query, values, function (error, post) {
    const model = {
      post,
    };
    response.render("post.hbs", model);
  });
});

app.post("/posts/:id", function (request, response) {
  // const postID = posts.id;
  const comment = request.body.comment;

  const query = `INSERT INTO comments (comment) VALUES(?)`;

  const values = [comment];

  db.run(query, values, function (error) {
    response.redirect("/about");
    console.log("new comment added");
  });
});

//create page

app.get("/create", function (request, response) {
  const query = `SELECT * FROM posts`;

  db.all(query, function (error, posts) {
    const model = {
      posts,
    };
    response.render("create.hbs", model);
  });
});

app.post("/create", function (request, response) {
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

//edit button on create page

app.get("/editPost/:id", function (request, response) {
  const id = request.params.id;
});

//delete button oncreate page

app.post("/deletePost/:id", function (request, response) {
  const id = request.params.id;
});

//feedback page

app.get("/feedback", function (request, response) {
  const query = `SELECT * FROM feedback`;

  db.all(query, function (error, feedback) {
    const model = {
      feedback,
    };
    response.render("feedback.hbs", model);
  });
});

//contact page

app.post("/contact", function (request, response) {
  const name = request.body.feedbackName;
  const email = request.body.feedbackEmail;
  const feedback = request.body.feedback;

  const query = `INSERT INTO feedback (name, email, feedback) VALUES(?, ?, ?)`;

  const values = [name, email, feedback];

  db.run(query, values, function (error) {
    response.redirect("/thankYou");
  });
});

app.get("/contact", function (request, response) {
  response.render("contact.hbs");
});

//thank you page

app.get("/thankYou", function (request, response) {
  response.render("thankYou.hbs");
});

//about page

app.get("/about", function (request, response) {
  const query = `SELECT * FROM comments`;
  db.all(query, function (error, comments) {
    const model = {
      comments,
    };
    response.render("about.hbs", model);
  });
});

//log in page

app.get("/logIn", function (request, response) {
  response.render("logIn.hbs");
});

app.post("/logIn", function (request, response) {
  const username = request.body.username;
  const password = request.body.password;

  if (username == adminUsername && password == adminPassword) {
    request.session.isLoggedIn = true;
    response.redirect("/");
  } else {
    const model = {
      failedToLogIn: true,
    };
    response.render("logIn.hbs", model);
  }
});

app.listen(8080);

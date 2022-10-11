const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const like = require("like");
const bcrypt = require("bcrypt");
const multer = require("multer");
const db = new sqlite3.Database("database.db");
const expressSession = require("express-session");
const app = express();
const minRate = 1;
const maxRate = 5;
const minLength = 0;
const adminUsername = "admin";
const adminPassword = "difficultPasswordToGuess124";

const storage = multer.diskStorage({
  destination(request, file, cb) {
    cb(null, "public/uploads");
  },
  filename(request, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

db.run(`PRAGMA foreign_keys = ON`);

db.run(
  `CREATE TABLE IF NOT EXISTS posts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  success TEXT,
  struggle TEXT, 
  content TEXT,
  date TEXT,
  imageURL TEXT)`
);

db.run(
  `CREATE TABLE IF NOT EXISTS feedback(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  feedback TEXT,
  email TEXT,
  rate INTEGER)`
);

db.run(
  `CREATE TABLE IF NOT EXISTS comments(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postID INTEGER,
    comment TEXT,
    FOREIGN KEY(postID) REFERENCES posts(id) ON DELETE CASCADE)`
);

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

//all error handling functions

function getErrorMessagesForFilter(rate, name) {
  const errorMessages = [];
  if (isNaN(rate) && name == "") {
    errorMessages.push("Please enter valid rate and name");
  }
  if (rate < minRate) {
    errorMessages.push(
      "Please enter a rate between " + minRate + " and " + maxRate + "."
    );
  }
  if (rate > maxRate) {
    errorMessages.push(
      "Please enter a rate between " + minRate + " and " + maxRate + "."
    );
  }
  return errorMessages;
}

function getErrorMessagesForPosts(date, title, success, struggle, content) {
  const errorMessages = [];
  if (date.length == minLength) {
    errorMessages.push("The date field can't be empty.");
  }
  if (title.length == minLength) {
    errorMessages.push("The title field can't be empty.");
  }
  if (success.length == minLength) {
    errorMessages.push("The success field can't be empty.");
  }
  if (struggle.length == minLength) {
    errorMessages.push("The struggle field can't be empty.");
  }
  if (content.length == minLength) {
    errorMessages.push("The content field can't be empty.");
  }
  return errorMessages;
}

function getErrorMessagesForComments(comment) {
  const errorMessages = [];

  if (comment.length == minLength) {
    errorMessages.push("The comment field can't be empty.");
  }

  return errorMessages;
}

function getErrorMessagesForFeedback(name, email, feedback, rate) {
  const errorMessages = [];

  if (isNaN(rate)) {
    errorMessages.push("Please leave a star review");
  } else if (rate < minRate) {
    errorMessages.push(
      "Please enter a rate between " + minRate + " and " + maxRate + "."
    );
  } else if (maxRate < rate) {
    errorMessages.push(
      "Please enter a rate between " + minRate + " and " + maxRate + "."
    );
  }

  if (name.length == minLength) {
    errorMessages.push("The name field can't be empty.");
  }
  if (email.length == minLength) {
    errorMessages.push("The email field can't be empty.");
  }
  if (feedback.length == minLength) {
    errorMessages.push("The feedback field can't be empty.");
  }

  return errorMessages;
}

function getErrorMessagesForLogIn(
  enteredUsername,
  enteredPassword,
  adminUsername,
  adminPassword
) {
  const errorMessages = [];

  if (enteredUsername !== adminUsername) {
    errorMessages.push("Wrong username or password");
  }
  if (enteredPassword !== adminPassword) {
    errorMessages.push("Wrong username or password");
  }
  return errorMessages;
}

// home page

app.get("/", function (request, response) {
  response.render("home.hbs");
});

//posts page

app.get("/posts", function (request, response) {
  const query = `SELECT * FROM posts ORDER BY id DESC`;

  db.all(query, function (error, posts) {
    const errorMessages = [];

    if (error) {
      errorMessages.push("Internal server error");
    }

    const model = {
      errorMessages,
      posts,
    };
    response.render("posts.hbs", model);
  });
});

// chosen post page

app.get("/posts/:id", function (request, response) {
  const id = request.params.id;
  const queryPosts = `SELECT * FROM posts WHERE id = ?`;
  const queryComments = `SELECT * FROM comments WHERE postID = ?`;
  const values = [id];
  const errorMessages = [];

  db.get(queryPosts, values, function (error, post) {
    if (error) {
      errorMessages.push("Internal server error");
    }
    db.all(queryComments, values, function (error, comments) {
      if (error) {
        errorMessages.push("Internal server error");
      }
      const model = {
        errorMessages,
        post,
        comments,
      };
      response.render("post.hbs", model);
    });
  });
});

app.post("/posts/:id", function (request, response) {
  const postID = request.params.id;
  const comment = request.body.comment;

  const errorMessages = getErrorMessagesForComments(comment);

  if (errorMessages.length == 0) {
    const queryComments = `INSERT INTO comments (comment, postID) VALUES(?, ?)`;

    const values = [comment, postID];

    db.run(queryComments, values, function (error) {
      if (error) {
        errorMessages.push("Internal server error");
        const model = {
          errorMessages,
          postID,
          comment,
        };
        response.render("post.hbs", model);
      }
      response.redirect("/posts/" + postID);
    });
  } else {
    const queryPosts = `SELECT * FROM posts WHERE id = ?`;
    const queryComments = `SELECT * FROM comments WHERE postID = ?`;
    const values = [postID];

    db.get(queryPosts, values, function (error, post) {
      if (error) {
        errorMessages.push("Internal server error");
      }
      db.all(queryComments, values, function (error, comments) {
        if (error) {
          errorMessages.push("Internal server error");
        }
        const model = {
          errorMessages,
          post,
          comments,
        };
        response.render("post.hbs", model);
      });
    });
  }
});

//create page

app.get("/createPost", function (request, response) {
  if (request.session.isLoggedIn) {
    response.render("create.hbs");
  } else {
    response.redirect("/logIn");
  }
});

app.post("/createPost", upload.single("photo"), function (request, response) {
  const date = request.body.postDate;
  const title = request.body.postTitle;
  const success = request.body.postSuccess;
  const struggle = request.body.postStruggle;
  const content = request.body.postContent;

  const errorMessages = getErrorMessagesForPosts(
    date,
    title,
    success,
    struggle,
    content
  );

  if (!request.file) {
    errorMessages.push("Please upload a photo");
  }

  if (!request.session.isLoggedIn) {
    errorMessages.push("You have to log in");
  }

  if (errorMessages.length == 0) {
    const imageURL = request.file.filename;

    const query = `INSERT INTO posts (date, title, success, struggle, content, imageURL) VALUES(?, ?, ?, ?, ?, ?)`;

    const values = [date, title, success, struggle, content, imageURL];

    db.run(query, values, function (error) {
      if (error) {
        errorMessages.push("Internal server error");
        const model = {
          errorMessages,
          date,
          title,
          success,
          struggle,
          content,
        };
        response.render("create.hbs", model);
      }
      response.redirect("/posts");
    });
  } else {
    const query = `SELECT * FROM posts`;

    db.all(query, function (error, posts) {
      if (error) {
        errorMessages.push("Internal server error");
        const model = {
          errorMessages,
          date,
          title,
          success,
          struggle,
          content,
          posts,
        };
        response.render("create.hbs", model);
      } else {
        const model = {
          errorMessages,
          date,
          title,
          success,
          struggle,
          content,
          posts,
        };
        response.render("create.hbs", model);
      }
    });
  }
});

// editing & deleting section
//edit post

app.get("/editPost/:id", function (request, response) {
  const id = request.params.id;
  const queryPosts = `SELECT * FROM posts WHERE id = ?`;
  const values = [id];

  db.get(queryPosts, values, function (error, post) {
    const errorMessages = [];

    if (error) {
      errorMessages.push("Internal server error");
    }
    const model = {
      errorMessages,
      post,
      id,
    };

    if (request.session.isLoggedIn) {
      response.render("editPost.hbs", model);
    } else {
      response.redirect("/logIn");
    }
  });
});

app.post("/editPost/:id", upload.single("photo"), function (request, response) {
  const id = request.params.id;
  const date = request.body.postDate;
  const title = request.body.postTitle;
  const success = request.body.postSuccess;
  const struggle = request.body.postStruggle;
  const content = request.body.postContent;

  const errorMessages = getErrorMessagesForPosts(
    date,
    title,
    success,
    struggle,
    content
  );

  if (!request.file) {
    errorMessages.push("Please upload a photo");
  }

  if (!request.session.isLoggedIn) {
    errorMessages.push("You have to log in");
  }

  if (errorMessages.length == 0) {
    const imageURL = request.file.filename;
    const query = `UPDATE posts
  SET date = ?, title = ?, success = ?, struggle = ?, content = ?, imageURL = ? WHERE id = ?;`;

    const values = [date, title, success, struggle, content, imageURL, id];

    db.run(query, values, function (error) {
      if (error) {
        errorMessages.push("Internal server error");
        const model = {
          errorMessages,
          date,
          title,
          success,
          struggle,
          content,
          id,
        };
        response.render("editPost.hbs", model);
      }
      response.redirect("/posts");
    });
  } else {
    const queryPosts = `SELECT * FROM posts WHERE id = ?`;
    const values = [id];

    db.get(queryPosts, values, function (error, post) {
      if (error) {
        errorMessages.push("Internal server error");
        const model = {
          post: {
            date,
            title,
            success,
            struggle,
            content,
          },
          id,
          errorMessages,
        };
        response.render("editPost.hbs", model);
      } else {
        const model = {
          post: {
            date,
            title,
            success,
            struggle,
            content,
          },
          id,
          errorMessages,
        };
        response.render("editPost.hbs", model);
      }
    });
  }
});

//delete post

app.post("/deletePost/:id", function (request, response) {
  const id = request.params.id;
  const values = [id];

  if (!request.session.isLoggedIn) {
    errorMessages.push("You have to log in");
  }
  const query = `DELETE FROM posts WHERE id = ?;`;

  db.run(query, values, function (error) {
    if (error) {
      errorMessages.push("Internal server error");
      const model = {
        errorMessages,
        id,
      };
      response.render("posts.hbs", model);
    }
    response.redirect("/posts");
  });
});

//edit comment

app.get("/editComment/:id", function (request, response) {
  const id = request.params.id;
  const queryPosts = `SELECT * FROM comments WHERE id = ?`;
  const values = [id];

  db.get(queryPosts, values, function (error, comment) {
    const errorMessages = [];

    if (error) {
      errorMessages.push("Internal server error");
    }
    const model = {
      errorMessages,
      comment,
      id,
    };

    if (request.session.isLoggedIn) {
      response.render("editComment.hbs", model);
    } else {
      response.redirect("/logIn");
    }
  });
});

app.post("/editComment/:id/:postID", function (request, response) {
  const id = request.params.id;
  const postID = request.params.postID;
  const comment = request.body.comment;
  const values = [comment, id];

  const errorMessages = getErrorMessagesForComments(comment);

  if (!request.session.isLoggedIn) {
    errorMessages.push("You have to log in");
  }

  if (errorMessages.length == 0) {
    const query = `UPDATE comments
  SET comment = ? WHERE id = ?;`;

    db.run(query, values, function (error) {
      if (error) {
        errorMessages.push("Internal server error");
        const model = {
          errorMessages,
          id,
          postID,
          comment,
        };
        response.render("editComment.hbs", model);
      }
      response.redirect("/posts/" + postID);
    });
  } else {
    const queryPosts = `SELECT * FROM comments WHERE id = ?`;
    const values = [id];

    db.get(queryPosts, values, function (error, comment) {
      if (error) {
        errorMessages.push("Internal server error");
        const model = {
          errorMessages,
          id,
          postID,
          comment,
        };
        response.render("editComment.hbs", model);
      } else {
        const model = {
          errorMessages,
          id,
          postID,
          comment,
        };
        response.render("editComment.hbs", model);
      }
    });
  }
});

//delete comment

app.post("/deleteComment/:id/:postID", function (request, response) {
  const id = request.params.id;
  const postID = request.params.postID;
  const values = [id];

  if (!request.session.isLoggedIn) {
    errorMessages.push("You have to log in");
  }
  const query = `DELETE FROM comments WHERE id = ?;`;

  db.run(query, values, function (error) {
    if (error) {
      errorMessages.push("Internal server error");
      const model = {
        errorMessages,
        id,
        postID,
      };
      response.render("posts.hbs", model);
    }
    response.redirect("/posts/" + postID);
  });
});

//edit feedback

app.get("/editFeedback/:id", function (request, response) {
  const id = request.params.id;
  const queryPosts = `SELECT * FROM feedback WHERE id = ?`;
  const values = [id];

  db.get(queryPosts, values, function (error, oneFeedback) {
    const errorMessages = [];

    if (error) {
      errorMessages.push("Internal server error");
    }
    const model = {
      errorMessages,
      oneFeedback,
      id,
    };

    if (request.session.isLoggedIn) {
      response.render("editFeedback.hbs", model);
    } else {
      response.redirect("/logIn");
    }
  });
});

app.post("/editFeedback/:id", function (request, response) {
  const id = request.params.id;
  const name = request.body.feedbackName;
  const email = request.body.feedbackEmail;
  const feedback = request.body.feedback;
  const rate = request.body.rate;
  const values = [name, email, feedback, rate, id];

  const errorMessages = getErrorMessagesForFeedback(
    name,
    email,
    feedback,
    rate
  );

  if (!request.session.isLoggedIn) {
    errorMessages.push("You have to log in");
  }

  if (errorMessages.length == 0) {
    const query = `UPDATE feedback
  SET name = ?, email = ?, feedback = ?, rate = ? WHERE id = ?;`;

    db.run(query, values, function (error) {
      if (error) {
        errorMessages.push("Internal server error");
        const model = {
          errorMessages,
          name,
          email,
          feedback,
          rate,
          id,
        };
        response.render("editFeedback.hbs", model);
      }
      response.redirect("/feedback");
    });
  } else {
    const queryPosts = `SELECT * FROM feedback WHERE id = ?`;
    const values = [id];

    db.get(queryPosts, values, function (error, oneFeedback) {
      if (error) {
        errorMessages.push("Internal server error");
        const model = {
          errorMessages,
          name,
          email,
          feedback,
          rate,
          oneFeedback,
          id,
        };
        response.render("editFeedback.hbs", model);
      } else {
        const model = {
          oneFeedback: {
            name,
            email,
            feedback,
            rate,
          },
          id,
          errorMessages,
        };
        response.render("editFeedback.hbs", model);
      }
    });
  }
});

//delete feedback

app.post("/deleteFeedback/:id", function (request, response) {
  const id = request.params.id;
  const values = [id];

  if (!request.session.isLoggedIn) {
    errorMessages.push("You have to log in");
  }
  const query = `DELETE FROM feedback WHERE id = ?;`;

  db.run(query, values, function (error) {
    if (error) {
      errorMessages.push("Internal server error");
      const model = {
        errorMessages,
        id,
      };
      response.render("feedback.hbs", model);
    }
    response.redirect("/feedback");
  });
});

//feedback page

app.get("/feedback", function (request, response) {
  const query = `SELECT * FROM feedback ORDER BY id DESC`;

  db.all(query, function (error, feedback) {
    const errorMessages = [];

    if (error) {
      errorMessages.push("Internal server error");
    }
    const model = {
      errorMessages,
      feedback,
    };

    if (request.session.isLoggedIn) {
      response.render("feedback.hbs", model);
    } else {
      response.redirect("/logIn");
    }
  });
});

app.get("/feedback/review", function (request, response) {
  const rate = parseInt(request.query.filterRate, 10);
  const name = request.query.filterName;

  if (!request.session.isLoggedIn) {
    response.redirect("/logIn");
  } else {
    if (name && rate) {
      const values = ["%" + name + "%", "%" + rate + "%"];
      const query = `SELECT * FROM feedback WHERE name LIKE ? AND rate LIKE ?`;
      db.all(query, values, function (error, feedback) {
        const errorMessages = [];
        if (error) {
          errorMessages.push("Internal server error");
          const model = {
            errorMessages,
            feedback,
          };
          response.render("feedback.hbs", model);
        } else {
          const model = {
            feedback,
          };
          response.render("feedback.hbs", model);
        }
      });
    } else if (name) {
      const values = ["%" + name + "%"];
      const query = `SELECT * FROM feedback WHERE name LIKE ?`;
      db.all(query, values, function (error, feedback) {
        const errorMessages = [];
        if (error) {
          errorMessages.push("Internal server error");
          const model = {
            errorMessages,
            feedback,
          };
          response.render("feedback.hbs", model);
        } else {
          const model = {
            feedback,
          };
          response.render("feedback.hbs", model);
        }
      });
    } else if (1 <= rate && rate <= 5) {
      const values = ["%" + rate + "%"];
      const query = `SELECT * FROM feedback WHERE rate LIKE ?`;
      db.all(query, values, function (error, feedback) {
        if (error) {
          const model = {
            errorMessages: ["Internal server error"],
            feedback,
          };
          response.render("feedback.hbs", model);
        } else {
          const model = {
            feedback,
          };
          response.render("feedback.hbs", model);
        }
      });
    } else {
      const errorMessages = getErrorMessagesForFilter(rate, name);
      const model = {
        errorMessages,
      };
      response.render("feedback.hbs", model);
    }
  }
});

//contact page

app.post("/contact", function (request, response) {
  const name = request.body.feedbackName;
  const email = request.body.feedbackEmail;
  const feedback = request.body.feedback;
  const rate = request.body.rate;

  const errorMessages = getErrorMessagesForFeedback(
    name,
    email,
    feedback,
    rate
  );

  if (errorMessages.length == 0) {
    const query = `INSERT INTO feedback (name, email, feedback, rate) VALUES(?, ?, ?, ?)`;

    const values = [name, email, feedback, rate];

    db.run(query, values, function (error) {
      if (error) {
        errorMessages.push("Internal server error");
        const model = {
          errorMessages,
          name,
          email,
          feedback,
          rate,
        };
        response.render("contact.hbs", model);
      }
      response.redirect("/thankYou");
    });
  } else {
    const query = `SELECT * FROM feedback`;

    db.all(query, function (error, feedbackOne) {
      if (error) {
        errorMessages.push("Internal server error");
        const model = {
          errorMessages,
          name,
          email,
          feedback,
          rate,
        };

        response.render("contact.hbs", model);
      } else {
        const model = {
          errorMessages,
          name,
          email,
          feedback,
          rate,
        };
        response.render("contact.hbs", model);
      }
    });
  }
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
  response.render("about.hbs");
});

//log in page

app.get("/logIn", function (request, response) {
  response.render("logIn.hbs");
});

app.post("/logIn", function (request, response) {
  const enteredUsername = request.body.username;
  const enteredPassword = request.body.password;

  const errorMessages = getErrorMessagesForLogIn(
    enteredUsername,
    enteredPassword,
    adminUsername,
    adminPassword
  );
  if (errorMessages.length == 0) {
    request.session.isLoggedIn = true;
    response.redirect("/");
  } else {
    const model = {
      errorMessages,
    };
    response.render("logIn.hbs", model);
  }
});

//log out page
app.post("/logOut", function (request, response) {
  request.session.isLoggedIn = false;
  response.redirect("/");
});

app.listen(8080);

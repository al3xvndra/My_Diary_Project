const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("database.db");

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

//posts page

exports.getAllPosts = function (callback) {
  const query = `SELECT * FROM posts ORDER BY id DESC`;

  db.all(query, function (error, posts) {
    callback(error, posts);
  });
};

exports.createComment = function (comment, postID, callback) {
  const values = [comment, postID];
  const queryComments = `INSERT INTO comments (comment, postID) VALUES(?, ?)`;

  db.run(queryComments, values, function (error) {
    callback(error);
  });
};

exports.createPost = function (
  date,
  title,
  success,
  struggle,
  content,
  imageURL,
  callback
) {
  const query = `INSERT INTO posts (date, title, success, struggle, content, imageURL) VALUES(?, ?, ?, ?, ?, ?)`;

  const values = [date, title, success, struggle, content, imageURL];

  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.getEditPost = function (id, callback) {
  const queryPosts = `SELECT * FROM posts WHERE id = ?`;
  const values = [id];

  db.get(queryPosts, values, function (error, post) {
    callback(error, post);
  });
};

exports.editPost = function (
  date,
  title,
  success,
  struggle,
  content,
  imageURL,
  id,
  callback
) {
  const query = `UPDATE posts
  SET date = ?, title = ?, success = ?, struggle = ?, content = ?, imageURL = ? WHERE id = ?;`;

  const values = [date, title, success, struggle, content, imageURL, id];

  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.deletePost = function (id, callback) {
  const values = [id];
  const query = `DELETE FROM posts WHERE id = ?;`;

  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.getEditComment = function (id, callback) {
  const queryPosts = `SELECT * FROM comments WHERE id = ?`;
  const values = [id];

  db.get(queryPosts, values, function (error, comment) {
    callback(error, comment);
  });
};

exports.editComment = function (comment, id, callback) {
  const values = [comment, id];
  const query = `UPDATE comments
  SET comment = ? WHERE id = ?;`;

  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.deleteComment = function (id, callback) {
  const values = [id];
  const query = `DELETE FROM comments WHERE id = ?;`;

  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.getEditFeedback = function (id, callback) {
  const queryPosts = `SELECT * FROM feedback WHERE id = ?`;
  const values = [id];

  db.get(queryPosts, values, function (error, oneFeedback) {
    callback(error, oneFeedback);
  });
};

exports.editFeedback = function (name, email, feedback, rate, id, callback) {
  const values = [name, email, feedback, rate, id];
  const query = `UPDATE feedback
  SET name = ?, email = ?, feedback = ?, rate = ? WHERE id = ?;`;

  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.deleteFeedback = function (id, callback) {
  const values = [id];
  const query = `DELETE FROM feedback WHERE id = ?;`;

  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.getAllFeedback = function (callback) {
  const query = `SELECT * FROM feedback ORDER BY id DESC`;

  db.all(query, function (error, feedback) {
    callback(error, feedback);
  });
};

exports.getFeedbackFullReview = function (name, rate, callback) {
  const values = ["%" + name + "%", "%" + rate + "%"];
  const query = `SELECT * FROM feedback WHERE name LIKE ? AND rate LIKE ? ORDER BY id DESC`;
  db.all(query, values, function (error, feedback) {
    callback(error, feedback);
  });
};

exports.getFeedbackName = function (name, callback) {
  const values = ["%" + name + "%"];
  const query = `SELECT * FROM feedback WHERE name LIKE ? ORDER BY id DESC`;
  db.all(query, values, function (error, feedback) {
    callback(error, feedback);
  });
};

exports.getFeedbackRate = function (rate, callback) {
  const values = ["%" + rate + "%"];
  const query = `SELECT * FROM feedback WHERE rate LIKE ? ORDER BY id DESC`;
  db.all(query, values, function (error, feedback) {
    callback(error, feedback);
  });
};
exports.createFeedback = function (name, email, feedback, rate, callback) {
  const query = `INSERT INTO feedback (name, email, feedback, rate) VALUES(?, ?, ?, ?)`;

  const values = [name, email, feedback, rate];

  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.getOnePost = function (postID, callback) {
  const queryPosts = `SELECT * FROM posts WHERE id = ?`;
  const values = [postID];

  db.get(queryPosts, values, function (error, post) {
    callback(error, post);
  });
};

exports.getCommentsFromOnePost = function (postID, callback) {
  const queryComments = `SELECT * FROM comments WHERE postID = ?`;
  const values = [postID];
  db.all(queryComments, values, function (error, comments) {
    callback(error, comments);
  });
};

// !!!!!!!!!!!!!!
exports.extraComment = function (id, callback) {
  const queryPosts = `SELECT * FROM comments WHERE id = ?`;
  const values = [id];

  db.get(queryPosts, values, function (error, comment) {
    callback(error, comment);
  });
};

exports.extraFeedback = function (id, callback) {
  const queryPosts = `SELECT * FROM feedback WHERE id = ?`;
  const values = [id];

  db.get(queryPosts, values, function (error, oneFeedback) {
    callback(error, oneFeedback);
  });
};

exports.extraContact = function (callback) {
  const query = `SELECT * FROM feedback`;

  db.all(query, function (error, feedbackOne) {
    callback(error, feedbackOne);
  });
};

exports.createComment = function (callback) {};
exports.createComment = function (callback) {};
exports.createComment = function (callback) {};
exports.createComment = function (callback) {};
exports.createComment = function (callback) {};

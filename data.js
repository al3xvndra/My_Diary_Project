exports.posts = [
  {
    postId: 1, //primary key
    date: "18/09/22",
    title: "Creating the website",
    success: "I made delicious pancakes",
    struggle: "I burnt a pan",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

exports.feedback = [
  {
    feedbackId: 1, //primary key
    fName: "Michael",
    email: "me@gmail.com",
    feedback: "whatever",
  },
];

exports.comments = [
  {
    commentId: 2, //primary key
    commentDate: 22 / 09 / 22,
    // postId: 2, foreign key
    comment: "Me too",
  },
  {
    commentId: 1, //primary key
    // postId: 2, foreign key
    date: "22/09/22",
    time: "12:32:12",
    comment: "I love this post!",
  },
];

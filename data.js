exports.posts = [
  {
    id: 1, //primary key
    date: "23/09/2022",
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
    name: "Michael",
    feedback: "whatever",
    email: "me@gmail.com",
  },
];

exports.comments = [
  {
    id: 2, //primary key
    postID: 2, //foreign key
    comment: "Me too",
  },
];

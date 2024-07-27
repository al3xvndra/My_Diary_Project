
## My Virtual Diary

My Virtual Diary is a web application designed to share everyday moments, successes and struggles of a programmer in a form of a blog. The purpose of this project is to create a safe space on the internet, without judgement and exaggerated expectations from others. A place that you can come back to every time the perfect-life social media pressure is too heavy. 

This project was developed as a course project at Jönköping University School of Engineering.

## Deployment

To deploy this project run

```bash
  node app.js
```
The app runs on http://localhost:8080

## CRUD Operations

- Create: only admin can create the blog posts.
- Read: both users and admin can read blog posts and comments.
- Update: only admin can modify existing blog posts and comments.
- Delete: only admin can remove blog posts and comments.

## Features

Review filter: Admin can filter through received reviews, based on their star-rate and the name of the author.

Blog Interaction: Users can read blog posts and interact through comments.

Admin Interface: Allows for creating and managing blog posts,comments and feedback.

## Architecture

Utilizes a relational database with resources for blog posts, comments, and feedback messages. The web application's architecture facilitates efficient HTTP request handling.

## Technologies

My Virtual Diary was created using JavaScript, with the help of HTML, CSS, and Handlebars – a templating language implemented in JavaScript. The framework used in this project was Express. Some of the used packages that come from npm software library include:

- bcrypt – hashing the password,
- body-parser - parsing HTTP request body,
- express-session - establishing server-based sessions,
- multer - handling uploaded files

## Security

The application incorporates multiple security measures to handle vulnerabilities, such as injections, broken authentication, and XSS.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Post = require("./models/post");
const Comment = require("./models/comment");

/*
  We create an express app calling
  the express function.
*/
const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
*/
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  const { method, url } = req;
  console.log(`${method} ${url}`);
  next();
});
/*
  Endpoint to handle GET requests to the root URI "/"
*/
app.get("/posts", (req, res) => {
  Post.find().then((posts) => {
    res.status(200);
    res.json(posts);
  });
});

app.post("/posts", (req, res) => {
  Post.create(req.body)
    .then((newPost) => {
      console.log(newPost);
      res.status(201);
      res.json(newPost);
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: `Internal Error: ${error}`,
      });
    });
});

app.post("/comments", (req, res) => {
  Comment.create(req.body)
    .then((newComment) => {
      console.log(newComment);
      res.status(201);
      res.json(newComment);
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: `Internal Error: ${error}`,
      });
    });
});

app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  Post.findById(id)
    .then((post) => {
      res.status(200);
      res.json(post);
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: "Internal Server Error",
      });
    });
});

app.patch("/posts/:id", (req, res) => {
  const { id } = req.params;
  Post.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedPost) => {
      if (updatedPost) {
        res.status(200);
        res.json(updatedPost);
      } else {
        res.status(400);
        res.json({
          error: `Post with ${id} not found`,
        });
      }
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: "Internal Server Error",
      });
    });
});

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  Post.findByIdAndDelete(id)
    .then((post) => {
      res.status(204);
      res.json(post);
      console.log(`Post with id: ${id} was deleted`);
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: `Post with ${id} not deleted`,
      });
    });
});

/*
  We have to start the server. We make it listen on the port 4000

*/

const { PORT } = process.env;

mongoose.connect("mongodb://localhost/blogs", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongodb = mongoose.connection;

mongodb.on("open", () => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

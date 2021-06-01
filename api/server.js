// BUILD YOUR SERVER HERE
const express = require("express");
const User = require("./users/model");

const server = express();

server.use(express.json());

server.get("/api/users", (req, res) => {
  User.find(req.query)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "The users information could not be retrieved",
        error: error.message,
      });
    });
});

server.get("/api/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((users) => {
      if (users) {
        res.status(200).json(users);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "The user information could not be retrieved",
      });
    });
});

server.post("/api/users", (req, res) => {
  const newUser = req.body;
  if (!newUser.name || !newUser.bio) {
    res.status(400).json({
      message: "Please provide name and bio for the user",
    });
  } else {
    User.insert(newUser)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        res.status(500).json({
          message: "There was an error while saving the user to the database",
          err: err.message,
        });
      });
  }
});

server.delete("/api/users/:id", (req, res) => {
  User.remove(req.params.id)
    .then((deleteUser) => {
      if (!deleteUser) {
        res.status(404).json({
          message: "The user with the specified ID does not exist",
        });
      } else {
        res.json(deleteUser);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "The user could not be removed",
        err: err.message,
      });
    });
});

server.put("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  const edits = req.body;

  try {
    if (!edits.name || !edits.bio) {
      res
        .status(400)
        .json({ message: "Please provide name and bio for the user" });
    } else {
      const updatedUser = await User.update(id, edits);
      if (!updatedUser) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      } else {
        res.json(updatedUser);
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "The user information could not be modified",
    });
  }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}

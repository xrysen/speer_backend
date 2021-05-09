const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

const db = require("./database/db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 8000 || process.env.PORT;

app.use(
  cookieSession({
    name: "session",
    keys: ["userId"],
  })
);

app.get("/messages", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else {
    db.getUserById(req.query.session).then((result) => {
      if (!result.rows.length) {
        res.status(400).send("User doesn't exist");
      } else {
        db.getMessageSession(req.session.userId, req.query.session)
        .then((result) => res.status(200).send(result.rows));
      }
    })
  }
})

app.post("/messages", (req, res) => {
  db.getUserById(req.body.receiver).then((result) => {
    if (!req.session.userId) {
      res.status(400).send("You must be logged in to send a message");
    } else if (!result.rows.length) {
      res.status(400).send("User doesn't exist");
    } else {
      db.createMessage(req.session.userId, req.body.receiver, req.body.msgBody);
      res.status(200).send("Message sent!");
    }
  })
})

app.post("/tweets", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else {
    db.createTweet(req.session.userId, req.body.msgBody);
    res.status(200).send("Tweet created!");
  }
})

app.delete("/tweets", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else {
    db.deleteTweetById(req.body.tweetId);
    res.status(200).send("Successfully deleted");
  }
})

app.get("/tweets", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else {
    db.getTweetsForUser(req.session.userId)
    .then((result) => res.status(200).send(result.rows));
  }
})

app.get("/tweets/:id", (req, res) => {
  db.getTweetById(req.params.id)
  .then((result) => {
    if (!result.rows.length) {
      res.status(400).send("Tweet with that id doesn't exist");
    } else {
      res.status(200).send(result.rows);
    }
  })
})

app.put("/tweets/", (req, res) => {
  db.updateTweetById(req.body.id, req.body.msg);
  res.status(200).send("Tweet Updated");
})

app.post("/register", (req, res) => {
  db.getUserByName(req.body.userName.toLowerCase())
    .then((result) => {
      if (result.rows.length) {
        res
          .status(400)
          .send("A user with that name already exists. Please try another");
      } else {
        db.registerNewUser(
          req.body.name,
          req.body.userName.toLowerCase(),
          req.body.email,
          bcrypt.hashSync(req.body.password, 10)
        );
        res.status(200).send("User added successfully")
      }
    })
    .catch((err) => res.status(400).send(err));
});

app.post("/login", (req, res) => {
  db.getUserByName(req.body.userName.toLowerCase())
    .then((result) => {
      // Check if user name exists and password is correct
      if (
        !result.rows.length ||
        !bcrypt.compareSync(req.body.password, result.rows[0].password)
      ) {
        res.status(400).send("Either the user name or password are incorrect");
      } else {
        // Login user and start cookie session
        req.session.userId = result.rows[0].id;
        res.status(200).send("Succesfully logged in");
      }
    })
    .catch((err) => console.log(err));
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.status(200).send("Succesfully logged out");
})

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = server;
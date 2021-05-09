const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

const dbTweets = require("./database/helpers/dbTweets");
const dbLikes = require("./database/helpers/dbLikes");
const dbUsers = require("./database/helpers/dbUsers");
const dbMessages = require("./database/helpers/dbMessages");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 8000 || process.env.PORT;

app.use(
  cookieSession({
    name: "session",
    keys: ["userId"],
  })
);

app.post("/like", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else {
    dbTweets.getTweetById(req.body.tweetId).then((result) => {
      if (!result.rows.length) {
        res.status(400).send("The tweet with this id doesn't exist");
      } else {
        dbLikes
          .userAlreadyLikesTweet(req.session.userId, req.body.tweetId)
          .then((result) => {
            if (!result.rows.length) {
              dbLikes.addLikeToTweet(req.session.userId, req.body.tweetId);
              res.status(200).send("Successfully liked tweet");
            } else {
              dbLikes.removeLikeFromTweet(req.session.userId, req.body.tweetId);
              res.status(200).send("Successfully removed like from tweet");
            }
          });
      }
    });
  }
});

app.get("/messages", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else {
    dbUsers.getUserById(req.query.session).then((result) => {
      if (!result.rows.length) {
        res.status(400).send("User doesn't exist");
      } else {
        dbMessages
          .getMessageSession(req.session.userId, req.query.session)
          .then((result) => res.status(200).send(result.rows));
      }
    });
  }
});

app.post("/messages", (req, res) => {
  dbUsers.getUserById(req.body.receiver).then((result) => {
    if (!req.session.userId) {
      res.status(400).send("You must be logged in to send a message");
    } else if (!result.rows.length) {
      res.status(400).send("User doesn't exist");
    } else {
      dbMessages.createMessage(
        req.session.userId,
        req.body.receiver,
        req.body.msgBody
      );
      res.status(200).send("Message sent!");
    }
  });
});



const userRoutes = require("./routes/userRoutes");
const tweetRoutes = require("./routes/tweetRoutes");
app.use(userRoutes);
app.use(tweetRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = server;

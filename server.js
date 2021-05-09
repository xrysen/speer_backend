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

app.post("/tweets", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else if (req.body.isRetweet === "false") {
    dbTweets.createTweet(req.session.userId, req.body.msgBody);
    res.status(200).send("Tweet created!");
  } else if (!req.body.retweetId) {
    res.status(400).send("Tweet id for retweet not provided");
  } else {
    dbTweets.getTweetById(req.body.retweetId).then((result) => {
      if (!result.rows.length) {
        res.status(400).send("Tweet id doesn't exist");
      } else {
        dbTweets.createRetweet(
          req.session.userId,
          req.body.msgBody,
          req.body.retweetId
        );
        res.status(200).send("Succesfully retweeted post");
      }
    });
  }
});

app.delete("/tweets", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else {
    dbTweets.deleteTweetById(req.body.tweetId);
    res.status(200).send("Successfully deleted");
  }
});

app.get("/tweets", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else {
    dbTweets
      .getTweetsForUser(req.session.userId)
      .then((result) => res.status(200).send(result.rows));
  }
});

app.get("/tweets/:id", (req, res) => {
  dbTweets.getTweetById(req.params.id).then((result) => {
    if (!result.rows.length) {
      res.status(400).send("Tweet with that id doesn't exist");
    } else {
      res.status(200).send(result.rows);
    }
  });
});

app.put("/tweets/", (req, res) => {
  dbTweets.getTweetById(req.body.id).then((result) => {
    if (!result.rows.length) {
      res.status(400).send("Tweet with that id doesn't exist");
    } else {
      dbTweets.updateTweetById(req.body.id, req.body.msg);
      res.status(200).send("Tweet Updated");
    }
  });
});

app.post("/register", (req, res) => {
  dbUsers
    .getUserByName(req.body.userName.toLowerCase())
    .then((result) => {
      if (result.rows.length) {
        res
          .status(400)
          .send("A user with that name already exists. Please try another");
      } else {
        dbUsers.registerNewUser(
          req.body.name,
          req.body.userName.toLowerCase(),
          req.body.email,
          bcrypt.hashSync(req.body.password, 10)
        );
        res.status(200).send("User added successfully");
      }
    })
    .catch((err) => res.status(400).send(err));
});

app.post("/login", (req, res) => {
  dbUsers
    .getUserByName(req.body.userName.toLowerCase())
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
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = server;

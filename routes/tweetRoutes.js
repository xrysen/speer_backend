const router = require("express").Router();
const db = require("../database/helpers/dbTweets");

router.post("/tweets", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else if (req.body.isRetweet === "false") {
    db.createTweet(req.session.userId, req.body.msgBody);
    res.status(200).send("Tweet created!");
  } else if (!req.body.retweetId) {
    res.status(400).send("Tweet id for retweet not provided");
  } else {
    db.getTweetById(req.body.retweetId).then((result) => {
      if (!result.rows.length) {
        res.status(400).send("Tweet id doesn't exist");
      } else {
        db.createRetweet(
          req.session.userId,
          req.body.msgBody,
          req.body.retweetId
        );
        res.status(200).send("Succesfully retweeted post");
      }
    });
  }
});

router.delete("/tweets", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else {
    db.getTweetById(req.body.tweetId).then((result) => {
      if (!result.rows.length) {
        res.status(400).send("Tweet with this id doesn't exist");
      } else {
        if (result.rows[0].user_id === req.session.userId) {
          db.deleteTweetById(req.body.tweetId);
          res.status(200).send("Successfully deleted");
        } else {
          res.send(403).send("You don't have permission to do this");
        }
      }
    });
  }
});

router.get("/tweets", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else {
    db.getTweetsForUser(req.session.userId).then((result) =>
      res.status(200).send(result.rows)
    );
  }
});

router.get("/tweets/:id", (req, res) => {
  db.getTweetById(req.params.id).then((result) => {
    if (!result.rows.length) {
      res.status(400).send("Tweet with that id doesn't exist");
    } else {
      res.status(200).send(result.rows);
    }
  });
});

router.put("/tweets/", (req, res) => {
  db.getTweetById(req.body.id).then((result) => {
    if (!result.rows.length) {
      res.status(400).send("Tweet with that id doesn't exist");
    } else {
      db.updateTweetById(req.body.id, req.body.msg);
      res.status(200).send("Tweet Updated");
    }
  });
});

module.exports = router;

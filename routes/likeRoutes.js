const router = require("express").Router();
const db = require("../database/helpers/dbLikes");
const dbTweets = require("../database/helpers/dbTweets");

router.post("/like", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else {
    dbTweets.getTweetById(req.body.tweetId).then((result) => {
      if (!result.rows.length) {
        res.status(400).send("The tweet with this id doesn't exist");
      } else {
        db.userAlreadyLikesTweet(req.session.userId, req.body.tweetId).then(
          (result) => {
            if (!result.rows.length) {
              db.addLikeToTweet(req.session.userId, req.body.tweetId);
              res.status(200).send("Successfully liked tweet");
            } else {
              db.removeLikeFromTweet(req.session.userId, req.body.tweetId);
              res.status(200).send("Successfully removed like from tweet");
            }
          }
        );
      }
    });
  }
});

module.exports = router;

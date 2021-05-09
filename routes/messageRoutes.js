const router = require("express").Router();
const db = require("../database/helpers/dbMessages");
const dbUsers = require("../database/helpers/dbUsers");

router.get("/messages", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You must be logged in to view this page");
  } else {
    dbUsers.getUserById(req.query.session).then((result) => {
      if (!result.rows.length) {
        res.status(400).send("User doesn't exist");
      } else {
        db.getMessageSession(
          req.session.userId,
          req.query.session
        ).then((result) => res.status(200).send(result.rows));
      }
    });
  }
});

router.post("/messages", (req, res) => {
  dbUsers.getUserById(req.body.receiver).then((result) => {
    if (!req.session.userId) {
      res.status(400).send("You must be logged in to send a message");
    } else if (!result.rows.length) {
      res.status(400).send("User doesn't exist");
    } else {
      db.createMessage(req.session.userId, req.body.receiver, req.body.msgBody);
      res.status(200).send("Message sent!");
    }
  });
});

module.exports = router;

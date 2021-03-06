const router = require("express").Router();
const db = require("../database/helpers/dbUsers");
const bcrypt = require("bcrypt");


  router.post("/register", (req, res) => {
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
          res.status(200).send("User added successfully");
        }
      })
      .catch((err) => res.status(400).send(err));
  });

  router.post("/login", (req, res) => {
    db.getUserByName(req.body.userName.toLowerCase())
      .then((result) => {
        // Check if user name exists and password is correct
        if (
          !result.rows.length ||
          !bcrypt.compareSync(req.body.password, result.rows[0].password)
        ) {
          res
            .status(400)
            .send("Either the user name or password are incorrect");
        } else {
          // Login user and start cookie session
          req.session.userId = result.rows[0].id;
          res.status(200).send("Succesfully logged in");
        }
      })
      .catch((err) => console.log(err));
  });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.status(200).send("Succesfully logged out");
  });


  module.exports = router;

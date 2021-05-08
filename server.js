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

app.post("/register", (req, res) => {
  db.getUserByName(req.body.userName).then((result) => {
    if (result.rows.length) {
      res.status(400).send("A user with that name already exists. Please try another");
    } else {
      db.registerNewUser(
        req.body.name,
        req.body.userName,
        req.body.email,
        bcrypt.hashSync(req.body.password, 10)
      );
    }
  })
  .then(() => res.status(200).send("User added successfully"))
  .catch(err => res.status(400).send(err));
});

app.post("/login", (req, res) => {
  db.getUserByName(req.body.userName).then((result) => {
    if (!result.rows.length || !bcrypt.compareSync(req.body.password, result.rows[0].password)) {
      res.status(400).send("Either the user name or password are incorrect");
    } else {
      req.session.userId = result.rows[0].id;
      res.status(200).send("Succesfully logged in");
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

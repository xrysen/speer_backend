const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

const PORT = 8000 || process.env.PORT;

app.use(cookieSession({
  name: 'session',
  keys: ['userId']
}));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
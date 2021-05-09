const express = require("express");
const app = express();
const cookieSession = require("cookie-session");

app.use(express.urlencoded({ extended: true }));

const PORT = 8000 || process.env.PORT;

app.use(
  cookieSession({
    name: "session",
    keys: ["userId"],
  })
);

const userRoutes = require("./routes/userRoutes");
const tweetRoutes = require("./routes/tweetRoutes");
const messageRoutes = require("./routes/messageRoutes");
const likeRoutes = require("./routes/likeRoutes");

app.use(userRoutes);
app.use(tweetRoutes);
app.use(messageRoutes);
app.use(likeRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = server;

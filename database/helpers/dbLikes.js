require("dotenv").config();

const { Pool } = require("pg");

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
  connectionString: connectionString,
});

const addLikeToTweet = (userId, tweetId) => {
  pool.query(
    `
    INSERT INTO likes (user_id, tweet_id)
    VALUES ($1, $2);
    `,
    [userId, tweetId]
  );
};

const removeLikeFromTweet = (userId, tweetId) => {
  pool.query(
    `DELETE FROM likes WHERE user_id = $1 AND tweet_id = $2;`, [userId, tweetId]
  );
};

const userAlreadyLikesTweet = (userId, tweetId) => {
  return pool.query(
    `SELECT * FROM likes WHERE user_id = $1 AND tweet_id = $2;`, [userId, tweetId]
  );
}

module.exports = {
  addLikeToTweet,
  removeLikeFromTweet,
  userAlreadyLikesTweet,
  pool
}
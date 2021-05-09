require("dotenv").config();

const { Pool } = require("pg");

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
  connectionString: connectionString,
});

const createTweet = (userId, msgBody) => {
  pool.query(
    `
    INSERT INTO tweets (body, user_id, date)
    VALUES ($2, $1, NOW());
    `,
    [userId, msgBody]
  );
};

const getTweetsForUser = (userId) => {
  return pool.query(`SELECT * FROM tweets WHERE user_id = ${userId};`);
};

const getTweetById = (tweetId) => {
  return pool.query(`SELECT * FROM tweets WHERE id = $1`, [tweetId]);
};

const deleteTweetById = (tweetId) => {
  pool.query(`DELETE FROM tweets WHERE id = $1;`, [tweetId]);
};

const updateTweetById = (tweetId, msgBody) => {
  pool.query(
    `
    UPDATE tweets SET body = $2, date = NOW() WHERE id = $1;
    `,
    [tweetId, msgBody]
  );
};

module.exports = {
  createTweet,
  getTweetsForUser,
  deleteTweetById,
  getTweetById,
  updateTweetById,
  pool,
};
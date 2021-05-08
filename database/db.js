require("dotenv").config();

const { Pool } = require("pg");

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
  connectionString: connectionString,
});

const registerNewUser = (name, userName, email, password) => {
  pool.query(
    `
    INSERT INTO users (name, user_name, email, password) 
    VALUES ($1, $2, $3, $4);
    `,
    [name, userName, email, password]
  );
};

const createMessage = (sender, receiver, msgBody) => {
  const timeStamp = new Date();
  pool.query(
    `
    INSERT INTO messages (sender_id, rec_id, msg_body, sent_on)
    VALUES ($1, $2, $3, NOW());
    `,
    [sender, receiver, msgBody]
  );
};

const getAllMessagesForUser = (user) => {
  return pool.query(
    `SELECT msg_body FROM messages WHERE sender_id = '${user}';`
  );
};

const getMessageById = (id) => {
  return pool.query(`SELECT * FROM messages WHERE id = ${id};`);
};

const getMessageSession = (senderId, recId) => {
  return pool.query(
    `SELECT * FROM messages WHERE sender_id = ${senderId} AND rec_id = ${recId} OR (rec_id = ${senderId} AND sender_id = ${recId}) ORDER BY sent_on;`
  );
};

const getUserByName = (name) => {
  return pool.query(`SELECT * FROM users WHERE user_name = '${name}'; `);
};

const getUserById = (id) => {
  return pool.query(`SELECT * FROM users WHERE id = ${id};`);
};

const deleteUserByUserName = (userName) => {
  pool.query(
    `
    DELETE FROM users WHERE user_name = $1
    `,
    [userName]
  );
};

const resetUserTable = async () => {
  await pool.query(
    `DROP IF EXISTS users CASCADE;

    CREATE TABLE users (
      id SERIAL PRIMARY KEY NOT NULL,
      name VARCHAR(255) NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    );`
  );
};

const createTweet = (userId, msgBody) => {
  pool.query(
    `
    INSERT INTO tweets (body, user_id, date)
    VALUES ($2, $1, NOW());
    `
  ,
    [userId, msgBody]);
};

const getTweetsForUser = (userId) => {
  return pool.query(`SELECT * FROM tweets WHERE user_id = ${userId};`);
};

const deleteTweetById = (tweetId) => {
  pool.query(`DELETE FROM tweets WHERE id = $1;`, [tweetId]);
}

module.exports = {
  registerNewUser,
  getUserByName,
  deleteUserByUserName,
  resetUserTable,
  createMessage,
  getAllMessagesForUser,
  getUserById,
  getMessageById,
  getMessageSession,
  createTweet,
  getTweetsForUser,
  deleteTweetById
};

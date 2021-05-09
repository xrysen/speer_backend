require("dotenv").config();

const { Pool } = require("pg");

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
  connectionString: connectionString,
});

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

module.exports = {
  createMessage,
  getAllMessagesForUser,
  getMessageById,
  getMessageSession,
  pool
}
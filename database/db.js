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
    `, [name, userName, email, password]
  );
}

const getUserByName = (name) => {
  return pool.query (
    `SELECT users.id FROM users WHERE user_name = '${name}'; `
  );
}

module.exports = {
  registerNewUser,
  getUserByName
}
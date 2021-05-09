const db = require("../database/helpers/dbLikes");

const resetDB = () => {
  db.pool.query(
    `DROP TABLE IF EXISTS users CASCADE;
       CREATE TABLE users (
         id SERIAL PRIMARY KEY NOT NULL,
         name VARCHAR(255) NOT NULL,
         user_name VARCHAR(255) NOT NULL,
         email VARCHAR(255) NOT NULL,
         password VARCHAR(255) NOT NULL
       );
    
       INSERT INTO users (name, user_name, email, password)
      VALUES ('Sally', 'sassysally', 'sally@gmail.com', '$2b$10$E0ugzUL3fDUeNkY61IzRBeFqhLmObVtuF2sxf1VPGas0FAW3srrvO');
      
      INSERT INTO users (name, user_name, email, password)
      VALUES('Bob', 'superbob', 'bob@gmail.com',  'password');

      DROP TABLE IF EXISTS likes CASCADE;
      CREATE TABLE likes (
        id SERIAL PRIMARY KEY NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        tweet_id INTEGER REFERENCES tweets(id) ON DELETE CASCADE
      );

      DROP TABLE IF EXISTS messages CASCADE;

      CREATE TABLE messages (
        id SERIAL PRIMARY KEY NOT NULL,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rec_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        msg_body TEXT NOT NULL,
        sent_on TIMESTAMP
      );

      DROP TABLE IF EXISTS tweets CASCADE;
       CREATE TABLE tweets (
        id SERIAL PRIMARY KEY NOT NULL,
        body TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        date TIMESTAMP NOT NULL,
        istweet BOOLEAN NOT NULL,
        retweet_id INTEGER REFERENCES tweets(id)
      );

      INSERT INTO tweets (body, user_id, date, istweet)
      VALUES ('Just a small town girl', 1, NOW(), 'false');

      INSERT INTO tweets (body, user_id, date, istweet) 
      VALUES ('Living in a lonely world', 1, NOW(), 'false');

      DROP TABLE IF EXISTS likes CASCADE;
      CREATE TABLE likes (
        id SERIAL PRIMARY KEY NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        tweet_id INTEGER REFERENCES tweets(id) ON DELETE CASCADE
      );

      INSERT INTO likes (user_id, tweet_id)
      VALUES (1, 1);
      `
  )
}

module.exports = {
  resetDB
}
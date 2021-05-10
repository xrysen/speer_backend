DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
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
  user_id INTEGER references users(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  isRetweet BOOLEAN DEFAULT false,
  retweet_id INTEGER REFERENCES tweets(id)
);

DROP TABLE IF EXISTS likes CASCADE;

CREATE TABLE likes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  tweet_id INTEGER REFERENCES tweets(id) ON DELETE CASCADE
);


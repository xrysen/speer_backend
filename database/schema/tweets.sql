DROP TABLE IF EXISTS tweets CASCADE;

CREATE TABLE tweets (
  id SERIAL PRIMARY KEY NOT NULL,
  body TEXT NOT NULL,
  user_id INTEGER references users(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  isRetweet BOOLEAN DEFAULT false,
  retweet_id INTEGER REFERENCES tweets(id)
);
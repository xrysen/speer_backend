DROP TABLE IF EXISTS likes CASCADE;

CREATE TABLE likes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  tweet_id INTEGER REFERENCES tweets(id) ON DELETE CASCADE
);
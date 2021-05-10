# Twitter Backend
A backend for a twitter clone tracking users, messages, tweets and likes.

## Technologies
- Node
- Express
- Postresql
- Mocha/ChaiHTTP for testing

## Installation
- Clone this repo and run npm install
- Next set up your database by runnin ```psql -U {your username} -d {your database name}```
- set up a .env file following the example in example.env in this repo
- Once connected through psql run ```\i database\schema.sql``` to set up the tables
- ```npm start``` will run the express server listening on port 8000
- ```npm test``` will run the tests

## Testing Endpoints manually
- ```/register``` POST expects name, userName, email and password fields
- ```/login``` POST expects a userName and password field
- ```/tweets``` POST expects a msgBody field for a new tweet, or msgBody, isRetweet (true or false) and a tweetId for retweets
- ```/tweets``` DELETE expects a tweetId field
- ```/tweets``` UPDATE expects an id and msg field
- ```/tweets``` GET will get all tweets for the logged in user
- ```/tweets/:id``` GET will get the specific tweet with that id
- ```/messages``` GET expects a userID field
- ```/messages``` POST expects a receiver (id) and msgBody field
- ```/like``` POST expects a tweetId field

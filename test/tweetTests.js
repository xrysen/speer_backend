const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("../database/db");
const bcrypt = require("bcrypt");
const { expect } = require("chai");

process.env.NODE_ENV = "test";

chai.use(chaiHTTP);

describe("Creating tweets", () => {
  before(() => {
    const user = {
      userName: "sassysally",
      password: "ComeHackMeBro",
    };
    db.pool.query(
      `DROP TABLE IF EXISTS tweets CASCADE;
       CREATE TABLE tweets (
         id SERIAL PRIMARY KEY NOT NULL,
         body TEXT NOT NULL,
         user_id INTEGER REFERENCES users(ud) ON DELETE CASCADE,
         date TIMESTAMP NOT NULL
       );
      `
    );
  });

  it("Shouldn't allow user to create a tweet when not logged in", () => {
    const tweet = {
      userId: 1,
      body: "Tweetle Dee Dee",
    };

    chai
      .request(server)
      .post("/tweets")
      .send(tweet)
      .end((err, res) => {
        res.should.have.status(400);
      });
  });
  
  it("Shouldn't allow a user to delete a tweet if not logged in", () => {
    chai
      .request(server).get("/tweets").end((err, res) => res.should.have.status(400));
  });

  it("Should allow a logged in user to create a tweet", () => {
    const agent = chai.request.agent(server);
    agent
      .post("/login")
      .send({ userName: "sassysally", password: "ComeHackMeBro" })
      .end((err, res) => {
        return agent
          .post("/tweets")
          .send({ msgBody: "Testing Tweets" })
          .end((err, res) => { res.should.have.status(200); agent.close(); });
      });
  });

});

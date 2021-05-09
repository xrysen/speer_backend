const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("../database/db");
const { expect } = require("chai");

process.env.NODE_ENV = "test";

chai.use(chaiHTTP);

describe("Creating tweets", () => {
  before(() => {
    db.pool.query(
      `DROP TABLE IF EXISTS tweets CASCADE;
       CREATE TABLE tweets (
        id SERIAL PRIMARY KEY NOT NULL,
        body TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        date TIMESTAMP NOT NULL
      );

      INSERT INTO tweets (body, user_id, date)
      VALUES ('Just a small town girl', 1, NOW());

      INSERT INTO tweets (body, user_id, date) 
      VALUES ('Living in a lonely world', 1, NOW());
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
      .request(server)
      .get("/tweets")
      .end((err, res) => res.should.have.status(400));
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
          .end((err, res) => {
            res.should.have.status(200);
            agent.close();
          });
      });
  });

  it("Should allow a logged in user to edit their tweet", () => {
    const agent = chai.request.agent(server);
    agent
      .post("/login")
      .send({ userName: "sassysally", password: "ComeHackMeBro" })
      .end((err, res) => {
        return agent
          .put("/tweets")
          .send({ id: 1, msg: "Updated tweet" })
          .end((err, res) => {
            res.should.have.status(200);
            agent.close();
          });
      });
  });

  it("Should allow a logged in user to delete a tweet", () => {
    const agent = chai.request.agent(server);
    agent
      .post("/login")
      .send({ userName: "sassysally", password: "ComeHackMeBro" })
      .end((err, res) => {
        return agent
          .delete("/tweets")
          .send({ tweetId: 2 })
          .end((err, res) => {
            res.should.have.status(200);
            agent.close();
          });
      });
  });
});

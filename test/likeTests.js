const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("./testHelpers");

process.env.NODE_ENV = "test";

chai.use(chaiHTTP);

describe("Likes", () => {
  before(() => {
    db.resetDB();
  });

  it("User should not be able to like a post if not logged in", () => {
    chai
      .request(server)
      .post("/like")
      .send({ userId: 1, tweetId: 1 })
      .end((err, res) => {
        res.should.have.status(400);
      });
  });

  it("User should not be able to like a post that doesn't exist", () => {
    const agent = chai.request.agent(server);
    agent
      .post("/login")
      .send({ userName: "sassysally", password: "ComeHackMeBro" })
      .end((err, res) => {
        return agent
          .post("/like")
          .send({ userId: 1, tweetId: 6 })
          .end((err, res) => {
            res.should.have.status(400);
            agent.close();
          });
      });
  });

  it("User should be able to like a post that does exist", () => {
    const agent = chai.request.agent(server);
    agent
      .post("/login")
      .send({ userName: "sassysally", password: "ComeHackMeBro" })
      .end((err, res) => {
        return agent
          .post("/like")
          .send({ userId: 1, tweetId: 2 })
          .end((err, res) => {
            res.should.have.status(200);
            agent.close();
          });
      });
  });

  it("User should be able to unlike a post that they've already liked", () => {
    const agent = chai.request.agent(server);
    agent
      .post("/login")
      .send({ userName: "sassysally", password: "ComeHackMeBro" })
      .end((err, res) => {
        return agent
          .post("/like")
          .send({ userId: 1, tweetId: 1 })
          .end((err, res) => {
            res.should.have.status(200);
            agent.close();
          });
      });
  });
});

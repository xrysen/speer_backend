const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("./testHelpers");
const { expect } = require("chai");

process.env.NODE_ENV = "test";

chai.use(chaiHTTP);

describe("Messaging", () => {
  before(() => {
    db.resetDB();
  });

  it("Should not show any messages if a user is not logged in", (done) => {
    chai
      .request(server)
      .get("/messages")
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("Should allow a logged in user to view their messages", function () {
    const agent = chai.request.agent(server);
    agent
      .post("/login")
      .send({ userName: "sassysally", password: "ComeHackMeBro" })
      .end((err, res) => {
        return agent.get("/messages").end((err, res) => {
          console.log(res.status);
          res.should.have.status(200);
          agent.close();
        });
      });
  });

  it("It should not allow a user to send a message to a user that doesn't exist", () => {
    const agent = chai.request.agent(server);
    agent
      .post("/login")
      .send({ userName: "sassysally", password: "ComeHackMeBro" })
      .end((err, res) => {
        return agent
          .post("/messages")
          .send({ receiver: 3, msgBody: "You blocked me, didn't you?" })
          .end((err, res) => {
            res.should.have.status(400);
            agent.close();
          });
      });
  });

  it("Should allow a logged in user to send a message", () => {
    const agent = chai.request.agent(server);
    agent
      .post("/login")
      .send({ userName: "sassysally", password: "ComeHackMeBro" })
      .end((err, res) => {
        return agent
          .post("/messages")
          .send({ receiver: 2, msgBody: "What's up?" })
          .end((err, res) => {
            res.should.have.status(200);
            agent.close();
          });
      });
  });
});

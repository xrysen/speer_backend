const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("./testHelpers");
const { expect } = require("chai");

process.env.NODE_ENV = "test";

chai.use(chaiHTTP);

describe("Tweets", () => {
  before(() => {
    db.resetDB();
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
          .send({ msgBody: "Testing Tweets", isRetweet: "false" })
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
            console.log(res.text);
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

  it ("Should allow a logged in user to retweet a post", () => {
    const agent = chai.request.agent(server);
    agent
    .post("/login")
    .send({userName: "sassysally", password: "ComeHackMeBro"})
    .end((err, res) => {
      return agent
      .post("/tweets")
      .send({msgBody: "Check this out!", isRetweet: "true", retweetId: 1})
      .end((err, res) => {
        res.should.have.status(200);
        agent.close();
      })
    })
  })

  it ("Should not allow a user to retweet a post that doesn't exist", () => {
    const agent = chai.request.agent(server);
    agent
    .post("/login")
    .send({userName: "sassysally", password: "ComeHackMeBro"})
    .end((err, res) => {
      return agent
      .post("/tweets")
      .send({msgBody: "Check this out!", isRetweet: "true", retweetId: 30})
      .end((err, res) => {
        res.should.have.status(400);
        agent.close();
      })
    })
  })
});

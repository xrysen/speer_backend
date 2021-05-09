const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("../database/db");
const { expect } = require("chai");

process.env.NODE_ENV = "test";

chai.use(chaiHTTP);

describe("Messaging", () => {
  before(() => {
    db.pool.query(
      `
      DROP TABLE IF EXISTS messages CASCADE;

      CREATE TABLE messages (
        id SERIAL PRIMARY KEY NOT NULL,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rec_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        msg_body TEXT NOT NULL,
        sent_on TIMESTAMP
      );

      DROP TABLE IF EXISTS users CASCADE;
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
       `
    );
  });

  it("Should not show any messages if a user is not logged in", () => {
    chai
      .request(server)
      .get("/messages")
      .end((err, res) => res.should.have.status(400));
  });

  it("Should allow a logged in user to view their messages", () => {
    const agent = chai.request.agent(server);
    agent
      .post("/login")
      .send({ userName: "sassysally", password: "ComeHackMeBro" })
      .end((err, res) => {
        return agent.get("/messages").end((err, res) => {
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

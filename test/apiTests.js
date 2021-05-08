const { assert } = require("chai");
const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("../database/db");

require("dotenv").config();

process.env.NODE_ENV = "test";

chai.use(chaiHTTP);

describe("/POST /register", () => {

  before((done) => {
    db.deleteUserByUserName("superBob");
    db.registerNewUser("Sally", "sassySal", "sassySal@gmail.com", "myMaidenName");
    done();
  })

  it("Should return status of 200 on succesfull register", (done) => {
    const user = {
      name: "Bob",
      userName: "superBob",
      email: "bob@gmail.com",
      password: "password"
    }
    
    chai.request(server).post("/register")
    .send(user)
    .end((err, res) => {
      if (err) {
        console.log(err);
      }
      res.should.have.status(200);
    });
    done();
  })

  it("Should return a status of 400 if a user name is taken", (done) => {
    const user = {
      name: "Sally",
      userName: "sassySal",
      email: "sassySal@gmail.com",
      password: "password"
    }

    chai.request(server).post("/register")
    .send(user)
    .end((err, res) => {
      if (err) {
        console.log(err);
      }
      res.should.have.status(400);
    })
    done();
  })
})
const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("./testHelpers");
const bcrypt = require("bcrypt");

process.env.NODE_ENV = "test";

chai.use(chaiHTTP);

describe("Login", () => {
  before(() => {
    db.resetDB();
  });

  it ("Shouldn't allow a none registered user to login", (done) => {
    const user = {
      userName: "jDean",
      password: "password"
    }

    chai.request(server).post("/login").send(user)
    .end((err, res) => {
      res.should.have.status(400);
      done();
    })
  })

  it ("Should allow a user to login", (done) => {
    const user = {
      userName: "sassysally",
      password: "ComeHackMeBro"
    }

    chai.request(server).post("/login").send(user)
    .end((err, res) => {
      res.should.have.status(200);
      done();
    })
  })

  it("User name isn't case sensitive when logging in", (done) => {
    const user = {
      userName: "saSsySaLly",
      password: "ComeHackMeBro"
    }

    chai.request(server).post("/login").send(user)
    .end((err, res) => {
      res.should.have.status(200);
      done();
    })
  })
})
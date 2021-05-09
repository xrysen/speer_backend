const { assert, expect } = require("chai");
const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("./testHelpers");
const bcrypt = require("bcrypt");

process.env.NODE_ENV = "test";

chai.use(chaiHTTP);

describe("registration", () => {
  before(() => {
    db.resetDB();
  });

  it("Should return a status of 200 on succesfull registration", () => {
    const user = {
      name: "bob",
      userName: "superBob",
      email: "bob@gmail.com",
      password: "password",
    };

    chai
      .request(server)
      .post("/register")
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
      });
  });

  it("Shouldn't allow a user to register with the same user name", () => {
    const user = {
      name: "Sally",
      userName: "sassysally",
      email: "sally@gmail.com",
      password: "password",
    };

    chai
      .request(server)
      .post("/register")
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
      });
  });

  it("User names aren't case sensitive", () => {
    const user = {
      name: "Sally",
      userName: "SasSySalLy",
      email: "sally@gmaill.com",
      password: "password",
    };

    chai
      .request(server)
      .post("/register")
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
      });
  });
});

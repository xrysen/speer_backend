const { assert, expect } = require("chai");
const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("../database/db");
const bcrypt = require("bcrypt");

process.env.NODE_ENV = "test";

chai.use(chaiHTTP);

describe("/POST /register", () => {
  before(() => {
    db.pool.query(
      `DROP TABLE IF EXISTS users CASCADE;
       CREATE TABLE users (
         id SERIAL PRIMARY KEY NOT NULL,
         name VARCHAR(255) NOT NULL,
         user_name VARCHAR(255) NOT NULL,
         email VARCHAR(255) NOT NULL,
         password VARCHAR(255) NOT NULL
       );
    
       INSERT INTO users (name, user_name, email, password)
      VALUES ('Sally', 'sassysally', 'sally@gmail.com', 'password');
      `
    );
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

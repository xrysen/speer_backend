const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("../database/db");
const bcrypt = require("bcrypt");

process.env.NODE_ENV = "test";

chai.use(chaiHTTP);

describe("Logging in", () => {
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
      VALUES ('Sally', 'sassysally', 'sally@gmail.com', '$2b$10$E0ugzUL3fDUeNkY61IzRBeFqhLmObVtuF2sxf1VPGas0FAW3srrvO');
      `
    );
  });

  it ("Shouldn't allow a none registered user to login", () => {
    const user = {
      userName: "jDean",
      password: "password"
    }

    chai.request(server).post("/login").send(user)
    .end((err, res) => {
      res.should.have.status(400);
    })
  })

  it ("Should allow a user to login", () => {
    const user = {
      userName: "sassysally",
      password: "ComeHackMeBro"
    }

    chai.request(server).post("/login").send(user)
    .end((err, res) => {
      res.should.have.status(200);
    })
  })

  it("User name isn't case sensitive when logging in", () => {
    const user = {
      userName: "saSsySaLly",
      password: "ComeHackMeBro"
    }

    chai.request(server).post("/login").send(user)
    .end((err, res) => {
      res.should.have.status(200);
    })
  })
})
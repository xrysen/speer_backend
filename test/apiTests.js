const { assert } = require("chai");
const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../server");
const { restart } = require("nodemon");
const should = chai.should();

require("dotenv").config();

process.env.NODE_ENV = "test";

chai.use(chaiHTTP);

describe("/POST /register", () => {
  before(() => {
    const pool = new Pool({
      connectionString: connectionString,
    });
  })
  it("Should return status of 200 on succesfull register", (done) => {
    chai.request(server).post("/register/?userName=user&name=Bob&email=bob@gmail.com&password=securepassword")
    .end((err, res) => {
      if (err) {
        console.log(err);
      }
      res.should.have.status(200);
    });
    done();
  })
})
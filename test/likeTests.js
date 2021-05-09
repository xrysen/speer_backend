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
  })
})
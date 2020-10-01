const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcryptjs = require('bcryptjs');


const usersRouter = require("../users/users-router.js");
const { default: xPoweredBy } = require("helmet/dist/middlewares/x-powered-by");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.get("/hash", (req, res) => { //what is a header mdn http messages, javascript object that is made of key value pair of strings (always strings)
//authorization= common authentication message
const password =req.headers.authorization
const secret = req.headers.secret;

const hash = hashString(secret)

if (password === 'mellon') {
  res.json({welcome: 'friend', secret: req.headers.secret, hash})
}else {
  res.status(401).json({ you: "cannot pass!"})

}
  res.json({ api: "up" });
});

function hashString(str) {
  //use bcrypt to hash the str argument and return the hash
  //look up bcryptjs
  const hash = bcryptjs.hashSync(str, 8) //2 to the power 8 is the number of times a new hash will come back//the bigger the number the better but also the slower

  return hash;
}

//$2a$08$fPMtofXOcr.9EdOfG4uAZuYVbhlEwftxUQ/wcMpYrZMNHSlMxH0Ae
//$2a$08$m8xklyrqOILkTVD/QAz2muK4JTm2nJpqVXwBBOv7xGwq3CIXHhznC
//same password with the exact same parameters, with two different hashes
module.exports = server;

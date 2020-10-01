const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcryptjs = require('bcryptjs');


const usersRouter = require("../users/users-router.js");
const { default: xPoweredBy } = require("helmet/dist/middlewares/x-powered-by");
const authRouter = require("../auth/auth-router.js")
const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter)

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.get("/hash", (req, res) => { //what is a header mdn http messages, javascript object that is made of key value pair of strings (always strings)
//authorization= common authentication message
const password =req.headers.authorization
const secret = req.headers.secret;

const hash = hashString(secret)

if (password === 'mellon') {
  res.json({welcome: 'friend', secret, hash})
}else {
  res.status(401).json({ you: "cannot pass!"})

}
  res.json({ api: "up" });
});

function hashString(str) {
  //use bcrypt to hash the str argument and return the hash
  //look up bcryptjs
   const rounds = process.env.HASH_ROUNDS || 4;
  const hash = bcryptjs.hashSync(str, rounds) //2 to the power 8 is the number of times a new hash will come back//the bigger the number the better but also the slower

  return hash;
}


module.exports = server;

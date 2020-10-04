const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcryptjs = require('bcryptjs');
const session = require('express-session')
const knexSessionStore = require('connect-session-knex')(session)


const usersRouter = require("../users/users-router.js");
const { default: xPoweredBy } = require("helmet/dist/middlewares/x-powered-by");
const authRouter = require("../auth/auth-router.js")
const dbConnection = require('../database/connection')

const server = express();

const sessionConfiguration = {
name:'monster', //default value is sid
secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe!',//key for encryption
cookie: {
  maxAge: 1000 * 60 * 10,  //how long it will take before it expires
  secure: process.env.USE_SECURE_COOKIES || false,  //send the cookie only over https (secure connections)
  httpOnly: true, // prevent JS code on client from accessing this cookie, should always be true
},
resave:false, //saves if there are changes 
saveUninitialized: true, //read docs, its related to GDPR compliance, you will get that from the client
store: {//how do we connect api connected to session to api connected to db
  knex: dbConnection,
  tablename: 'session',
  sidfieldname: 'sid', // session id field name
  createable: true, 
  clearInterval: 1000 * 60 * 30, //time to check and remove expired session from database //the session and cookie will expire, can i delete them? can I clear, so what is the timeframe to check if there are any expired sessions 

  //how do we connect the api  thats related to sessions to the api database 
},
}

server.use(session(sessionConfiguration));// enables session support 
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

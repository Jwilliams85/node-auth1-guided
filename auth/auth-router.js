const bcryptjs = require("bcryptjs"); //<< add this line 
const router = require("express").Router();

const Users = require("../users/users-model.js");

router.get("/", (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});

router.post('/register', (req, res) => {
  let creds = req.body;
  const rounds = process.env.HASH_ROUNDS || 4;

  const hash = bcryptjs.hashSync(creds.password, rounds);

  creds.password = hash;

  Users.add(creds)
  .then(saved => {
    res.status(201).json({ data: saved})
  })
  .catch(error => {
    res.status(500).json({ error: error.message})
  })
})

router.post('/login', (req, res) => {
  let creds = req.body
  const rounds = process.env.HASH_ROUNDS || 4;

  const hash = bcryptjs.hashSync(creds.password, rounds);

  creds.password = hash;

  Users.add(creds)
  .then(saved => {
    res.status(201).json({ data: saved})
  })
  .catch(error => {
    res.status(500).json({ error: error.message})
  })
})

router.get('/logout', (req, res) => { 
  res.status(204).end();
})
module.exports = router;

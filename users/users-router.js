const bcryptjs = require("bcryptjs"); //<< add this line 
const router = require("express").Router();

const Users = require("./users-model.js");

router.get("/", (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});

router.post('/register', (req, res) => {
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

router.post('/login', (req, res) => {
  const { username, password } = req.body;

Users.findBy({ username })
 .then(users => {
   const user = users[0];

      if(user && bcryptjs.compareSync(password, user.password)){
        res.status(200).json({ message: "welcome!"}) // the order that you put in the parameters is very important, first put in the guess of password
  }else {
    res.status(401).json({ message: 'Invalid credentials'})
  }
})
.catch(error => {
  res.status(500).json({error: error.message})
})

});

router.get('/logout', (req, res) => { 
  res.status(204).end();
})

module.exports = router;
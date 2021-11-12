const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../users/user-model')
const { JWT_SECRET } = require('../../secrets')
const { checkUsernameFree, validatePayload, checkUsernameExists } = require('./auth-middleware')

router.post('/register', validatePayload, checkUsernameFree, (req, res) => {
  let user = req.body;
  const rounds = 8
  const hash = bcrypt.hashSync(user.password, rounds)
  user.password = hash
  User.add(user)
    .then(users => {
      return res.status(201).json(users)
    }).catch(err => {
      console.log(err)
    })
});

router.post('/login', validatePayload, checkUsernameExists, (req, res) => {
  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    const token = buildToken(req.user)
    res.json({
      message: `welcome, ${req.user.username}`,
      token: token
    })
  } else {
    res.status(401).json({ message: "invalid credentials" })
  }
});

function buildToken(user) {
  const payload = {
    subject: user.user_id,
    role_name: user.role_name,
    username: user.username
  }
  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = router;

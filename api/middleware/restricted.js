const { JWT_SECRET } = require('../../secrets')
const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.json({ message: "token required" })
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({ message: "token invalid" })
    }
    req.decodedJwt = decoded
    next()
  })
};

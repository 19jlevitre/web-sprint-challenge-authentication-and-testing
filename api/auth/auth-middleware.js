const User = require('../../users/user-model')

const checkUsernameExists = async (req, res, next) => {
    try {
      const [user] = await User.findBy({username: req.body.username})
      if (user) {
        res.status(401).json({message: "username taken" })
      } else {
        req.user = user
        next()
      }
    } catch (err){
      next(err)
    }
  }

  const validatePayload = async (req, res, next) => {
    const { username, password } = req.body
    try{
        if(!username || !password){
            res.status(401).json({message: "username and password required"})
        }else{
            next()
        }
    }catch (err){
        console.log(err)
    }
  }

  module.exports = {
      checkUsernameExists,
      validatePayload
  }
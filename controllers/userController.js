const bcrypt = require("bcryptjs")
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_message', '密碼與確認密碼不相符！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_message', '此信箱已註冊')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
          }
        })
        .then(user => {
          return res.redirect('/signin')
        })
    }
  }
}
module.exports = userController
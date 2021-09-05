const fs = require('fs')

const bcrypt = require("bcryptjs")
const db = require('../models')
const imgur = require('imgur-node-api')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_message', '登入成功！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_message', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        Comment.findAndCountAll({
          raw: true,
          nest: true,
          include: Restaurant,
          where: { UserId: user.id }
        })
          .then(results => {
            console.log('results:', results.rows)
            const comments = results.rows.map(comment => ({
              ...comment,
              restaurantId: comment.RestaurantId,
              restaurantImage: comment.Restaurant.image
            }))
            console.log('comments:', comments)
            return res.render('profile',
              {
                user: user.toJSON(),
                comments,
                commentCounts: results.count
              })
          })
      })
  },

  editUser: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        if (user.id !== req.user.id) {
          req.flash('error_message', `Only ${user.name} can edit profile.`)
          return res.redirect('back')
        }
        return res.render('editProfile', { user: user.toJSON() })
      })
  },

  putUser: (req, res) => {
    const { name } = req.body
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name,
              image: file ? img.data.link : user.image
            })
              .then(user => {
                return res.redirect(`/users/${user.id}`)
              })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name,
            image: user.image
          })
            .then(user => {
              return res.redirect(`/users/${user.id}`)
            })
        })
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(() => {
        return res.redirect('back')
      })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        favorite.destroy()
        .then(() => {
          return res.redirect('back')
        })
      })
  }
}

module.exports = userController
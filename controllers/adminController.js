const fs = require('fs')

const db = require('../models')
const Restaurant = db.Restaurant
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/restaurant', {
        restaurant: restaurant
      })
    })
  },
  
  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body

    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req 
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
          return Restaurant.create({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: file ? img.data.link : null
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully created')
            return res.redirect('/admin/restaurants')
          })
        })
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
    }
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/create', { restaurant })
    })
  },

  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body

    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
          return Restaurant.findByPk(req.params.id)
            .then((restaurant) => {
              restaurant.update({
                name,
                tel,
                address,
                opening_hours,
                description,
                image: file ? img.data.link : restaurant.image
              }).then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
              })
            })
        })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: restaurant.image
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
        })
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
      })
      .then(() => {
        res.redirect('/admin/restaurants')
      })
  }
}

module.exports = adminController
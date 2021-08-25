const db = require('../models')
const Restaurant = db.Restaurant

const restController = {
   getRestaurants: (req, res) => {
     return Restaurant.findAll({ raw: true }).then(restaurants => {
       return res.render('admin/restaurants', { restaurants })
     })
   }
}

module.exports = restController
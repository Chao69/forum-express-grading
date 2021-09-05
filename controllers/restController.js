const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    let offset = 0
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    })
      .then(result => {
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? page : page + 1
        const data = result.rows.map(rest => ({
          ...rest.dataValues,
          description: rest.dataValues.description.substring(0, 50),
          categoryName: rest.Category.name,
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(rest.id),
          isLiked: req.user.LikedRestaurants.map(d => d.id).includes(rest.id)
        }))
        Category.findAll({
          raw: true,
          nest: true
        }).then(categories => {
          return res.render('restaurants', {
            restaurants: data,
            categories,
            categoryId,
            page,
            totalPage,
            prev,
            next,
          })
        })
      })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: Comment, include: [User] },
        { model: User, as: 'LikedUsers'}
      ]
    }).then(restaurant => {
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
      restaurant.increment('viewCounts', { by: 1 })
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited,
        isLiked
      })
    })
  },

  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', { restaurants, comments })
    })
  },

  getDashboard: (req, res) => {
    return Promise.all([
      Restaurant.findByPk(
        req.params.id,
        { include: Category }
      ),
      Comment.findAll({
        raw: true,
        nest: true,
        include: [Restaurant]
      })
    ]).then(([restaurant, comments]) => {
      const restaurantPure = restaurant.toJSON()
      let commentCounts = 0
      comments.forEach(comment => {
        if (comment.RestaurantId === restaurantPure.id) {
          commentCounts += 1
        }
      })
      return res.render('dashboard', {
        restaurant: restaurant.toJSON(),
        category: restaurant.toJSON().Category,
        commentCounts
      })
    })
  }
}

module.exports = restController
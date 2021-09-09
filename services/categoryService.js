const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    const id = req.params.id
    return Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        if (id) {
          Category.findByPk(id)
            .then(category => {
              return res.render('admin/categories', { categories, category })
            })
        } else {
          callback({ categories })
        }
      })
  },

  postCategory: (req, res, callback) => {
    const name = req.body.name

    if (!name) {
      callback({ status: 'error', message: "name didn't exist"})
    } else {
      return Category.create({
        name
      }).then((category) => {
        callback({ status: 'success', message: 'category was successfully created'})
      })
    }
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: "name didn't exist" })
    } else {
      return Category.findByPk(req.params.id)
        .then(category => {
          console.log(category.id)
          category.update(req.body)
        })
        .then(() => {
          callback({ status: 'success', message: 'category was successfully updated' })
        })
    }
  }
}

module.exports = categoryService
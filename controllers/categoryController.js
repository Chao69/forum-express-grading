const db = require('../models')
const Category = db.Category

const categoryService = require('../services/categoryService')

let categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },

  postCategory: (req, res) => {
    const name = req.body.name

    if (!name) {
      req.flash('error_message', "name didn't exist")
      return res.redirect('/admin/categories')
    } else {
      return Category.create({
        name
      }).then((category) => {
        return res.redirect('/admin/categories')
      })
    }
  },
  
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_message', "name didn't exist")
      return redirect('back')
    } else {
      return Category.findByPk(req.params.id)
      .then(category => {
        category.update(req.body)
      })
      .then(() => {
        res.redirect('/admin/categories')
      })
    }
  },

  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
      })
      .then(() => {
        res.redirect('/admin/categories')
      })
  }
}


module.exports = categoryController
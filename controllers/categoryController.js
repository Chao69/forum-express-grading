const db = require('../models')
const Category = db.Category

let categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      const id = req.params.id

      if (id) {
        Category.findByPk(id)
          .then((category) => {
            return res.render('admin/categories', {
              categories: categories,
              category: category.toJSON()
            })
          })
      } else {
        return res.render('admin/categories', { categories: categories })
      }
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
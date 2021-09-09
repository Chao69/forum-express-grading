const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')
const adminService = require('../services/adminService')

router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminService.putRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)


router.get('/admin/categories', categoryController.getCategories)

module.exports = router
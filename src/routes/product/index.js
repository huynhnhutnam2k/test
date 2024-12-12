'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.use(authentication)
router.get('/search/:keyword', productController.search)

router.get('/draft', productController.getDraft)
router.get('/published', productController.getPublished)

router.post('/published/:id', productController.published)
router.post('/unpublished/:id', productController.unPublished)

router.post('/', productController.createProduct)
router.get('/', productController.getAll)

module.exports = router
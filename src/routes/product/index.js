'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.get('/', productController.getAll)
router.get('/search/:keyword', productController.search)

router.use(authentication)

router.get('/draft', productController.getDraft)
router.get('/published', productController.getPublished)

router.post('/published/:id', productController.published)
router.post('/unpublished/:id', productController.unPublished)

router.post('/', productController.createProduct)

module.exports = router
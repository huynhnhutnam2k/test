'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')

const router = express.Router()

router.get('/search/:searchKey', productController.search)

router.get('/draft', productController.getDraft)
router.get('/published', productController.getPublished)

router.post('/published/:id', productController.published)
router.post('/unpublished/:id', productController.unPublished)

router.post('/', productController.createProduct)
router.get('/', productController.getAll)

module.exports = router
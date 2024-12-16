'use strict'

const express = require('express')
const checkoutController = require('../../controllers/checkout.controller')
const { asyncHandler } = require('../../auth/checkAuth')

const router = express.Router()

router.use('/review', asyncHandler(checkoutController.checkoutReview))

module.exports = router
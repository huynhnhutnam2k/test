"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const cartController = require("../../controllers/cart.controller");

const router = express.Router();

router.post('/', asyncHandler(cartController.addToCart))
router.post('/update/:id', asyncHandler(cartController.update))
router.post('/delete/:id', asyncHandler(cartController.delete))
router.get('/', asyncHandler(cartController.listToCart))

module.exports = router;

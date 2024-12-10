"use strict";

const express = require("express");

const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../auth/checkAuth");
const DiscountController = require("../../controllers/discount.controller");

const router = express.Router();

// router.get('/generate', )





// get all product by discount code [user]
router.get(
  "/list-product-code",
  asyncHandler(DiscountController.getDiscountCodesWithProducts)
);

// get discount amount [user]
router.post("/amount", asyncHandler(DiscountController.getDiscountAmount));

// delete discount code [Admin | shop]

// cancel discount code [User]
router.use(authentication);

// generateCode [shop | admin]
router.post("/", asyncHandler(DiscountController.createDiscountCode));
// get all discounts code [user | shop]
router.get("/", asyncHandler(DiscountController.getAllDiscountCodes));

module.exports = router;

"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res) => {
    new CREATED({
      message: "Create discount successfully",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
        s,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all discount codes",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query, 
        shopId: req.user.userId
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res) => {
    new SuccessResponse({
      message: "Get discount amount",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body
      }),
    }).send(res);
  };

  getDiscountCodesWithProducts = async (req, res) => {
    new SuccessResponse({
      message: "Get discount codes with products",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  };

}

module.exports = new DiscountController();

"use strict";

const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  findAllDiscountsCodesUnselect,
  checkDiscountExist,
} = require("../repo/discount.repo");
const { getAllProducts } = require("../repo/product.repo");
const { convertToObjectIdMongodb } = require("../utils");

class DiscountService {
  static async createDiscountCode(body) {
    const {
      code,
      start_date,
      end_date,
      isActive,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      type,
      description,
      value,
      max_uses,
      max_value,
      uses_count,
      max_uses_per_user,
    } = body;

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError(
        "start date must be before today and end date must be after today"
      );
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before end date");
    }

    // create index for discount code

    const foundDiscount = await discountModel
      .findOne({
        code,
        shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.isActive) {
      throw new ConflictRequestError("Conflicting discount");
    }

    const newDiscount = await discountModel.create({
      code,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      isActive,
      shopId: convertToObjectIdMongodb(shopId),
      min_order_value: min_order_value || 0,
      product_ids: applies_to === "all" ? [] : product_ids,
      applies_to,
      name,
      type,
      description,
      value,
      max_uses,
      max_value,
      uses_count,
      max_uses_per_user,
    });

    if (!newDiscount) {
      throw new BadRequestError("Create discount is not allowed");
    }

    return newDiscount;
  }

  static async updateDiscountCode() {}

  // get all discount code active with products
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    // create index for discount code
    const foundDiscount = await discountModel.findOne({
      code,
      shopId: convertToObjectIdMongodb(shopId),
    });
    if (!foundDiscount || !foundDiscount.isActive)
      throw new BadRequestError("Discount code not found");

    const { applies_to, product_ids } = foundDiscount;
    let products;
    if (applies_to == "all") {
      // get all product
      products = await getAllProducts({
        filter: {
          shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: parseInt(limit),
        page: parseInt(page),
        sort: "ctime",
        select: ["name"],
      });
    } else {
      // get product ids
      products = await getAllProducts({
        filter: {
          _id: {
            $in: product_ids,
          },
          isPublished: true,
        },
        limit: parseInt(limit),
        page: parseInt(page),
        sort: "ctime",
        select: ["name"],
      });
    }

    return products;
  }

  // get all discount code of shop
  static async getAllDiscountCodesByShop({
    limit = 50,
    sort = "ctime",
    shopId,
    page = 1,
    filter = {
      shopId: convertToObjectIdMongodb(shopId),
      isActive: true,
    },
  }) {
    const unselect = ["__v", "shopId"];
    const discounts = await findAllDiscountsCodesUnselect({
      limit,
      sort,
      filter,
      model: discountModel,
      page,
      unselect,
    });

    return discounts;
  }

  /**
   * apply discount code
   * products = [
   *    {
   *    productId,
   *    shopId,
   *    quantity,
   *    name,
   *    price
   *    }
   * ]
   */

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const filter = {
      _id: convertToObjectIdMongodb(codeId),
      // isActive: true,
      shopId: convertToObjectIdMongodb(shopId),
    };
    const foundProduct = await checkDiscountExist(filter);

    if (!foundProduct) {
      throw new BadRequestError("Discount not found");
    }

    const {
      isActive,
      max_uses,
      start_date,
      end_date,
      min_order_value,
      max_uses_per_user,
      user_used,
      type,
      value,
    } = foundProduct;

    if (!isActive) throw new BadRequestError("Discount expired");

    if (!max_uses) throw new BadRequestError("Discount is out stock");

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount encode has expired");
    }

    // check min value
    let totalOrder = 0;
    if (min_order_value > 0) {
      totalOrder = products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );

      if (totalOrder < min_order_value) {
        throw new BadRequestError(
          "Discount require a minimum order value of " + min_order_value
        );
      }
    }

    if (max_uses_per_user > 0) {
      const userDiscount = user_used.find((u) => u.userId === userId);
      if (userDiscount) {
        throw new BadRequestError("User has already been used this discount");
      }
    }

    const amount = type === "fixed_amount" ? value : totalOrder * (value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discountModel.findOneAndDelete({
      code: codeId,
      shopId: convertToObjectIdMongodbId(shopId),
    });

    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const filter = {
      code: codeId,
      shopId: convertToObjectIdMongodbId(shopId),
    };
    const foundDiscount = await checkDiscountExist(filter);

    if (!foundDiscount) throw new BadRequestError("Discount not found");

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        user_used: userId,
      },
      $inc: {
        max_uses: 1,
        uses_count: -1,
      },
    });

    return result
  }
}

module.exports = DiscountService

"use strict";

const { BadRequestError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { getProductById } = require("../repo/product.repo");
/**
 * 1. Add product  to card [user]
 * 2. Reduce product quantity [user]
 * 3. increase product quantity [user]
 * 4. get list to cart [user]
 * 5. delete cart [user]
 * 6. delete cart item
 */

class CartService {
  static async createUserCart({ userId, product }) {
    const query = {
        userId,
        state: "active",
      },
      updateOrInsert = {
        $addToSet: {
          products: product,
        },
      },
      option = {
        upsert: true,
        new: true,
      };

    return await cart.findOneAndUpdate(query, updateOrInsert, option);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        userId,
        "products.productId": productId,
        state: "active",
      },
      updateSet = {
        $inc: {
          "products.$.quantity": quantity,
        },
      },
      option = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateSet, option);
  }

  static async addToCart({ userId, product }) {
    const userCart = await cart.findOne({ userId });
    if (!userCart) {
      return await CartService.createUserCart({ userId, product });
    }

    if (userCart.products.length === 0) {
      userCart.products = [product];
      return await userCart.save();
    }
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  //   shop_order_ids: [
  //     {
  //         shopId,
  //         item_products: [
  //             {
  //                 quantity,
  //                 price,
  //                 shopId,
  //                 old_quantity,
  //                 productId
  //             }
  //         ]
  //     }
  //   ]
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await getProductById(productId);

    if (!foundProduct) {
      throw new BadRequestError("Product not found");
    }

    if (foundProduct.shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new BadRequestError("Product do not belong to the shop");
    }

    if (quantity === 0) {
      return await CartService.deleteUserCart({ userId, productId });
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = {
        userId,
        state: "active",
      },
      updateSet = {
        $pull: {
          products: {
            productId,
          },
        },
      };

    const deleteCart = await cart.updateOne(query, updateSet);

    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return cart.findOne({ userId, state: "active" }).lean();
  }
}

module.exports = CartService;

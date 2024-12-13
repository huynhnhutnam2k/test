"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
  {
    state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
    },
    products: {
      type: Array,
      default: [],
      required: true,
      // [
      //     {
      //         productId,
      //         shopId,
      //         quantity,
      //         name,
      //         price
      //     }
      // ]
    },
    count_product: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  {
    // timestamps: true,
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createOn",
      updatedAt: "modifiedOn",
    },
  }
);

module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
};

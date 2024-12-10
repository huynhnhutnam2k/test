"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";
const discountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "fixed_amount", // percentage
    },
    description: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    max_uses: {
      type: Number,
      required: true,
    },
    uses_count: {
      type: Number,
      required: true,
    },
    user_used: {
      type: Array,
      default: [],
    },
    max_uses_per_user: {
      type: Number,
      required: true,
    },
    min_order_value: {
      type: Number,
      required: true,
    },
    max_value: {
        type: Number,
        // required: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    product_ids: {
      type: Array,
      default: [], // if applies to is specific
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);

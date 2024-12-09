'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'
const inventorySchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    location: {
        type: String,
        default: 'unknown'
    },
    stock: {
        type: Number,
        required: true
    },
    shopId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // đặt trước, khi thêm vào giỏ hàng thì sẽ thêm vào
    reservations: {
        type: Array,
        default: []
    }
    /**
     * cartId:
     * stock: 2
     * createdAt
     */
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}
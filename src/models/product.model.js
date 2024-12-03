'use strict'

const { Schema, model } = require('mongoose')
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    thumb: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['Electronic', 'Clothing', 'Furniture']
    },

    shop: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    attributes: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String,
    },
    material: {
        type: String
    },
}, {
    collection: 'clothes',
    timestamps: true
})

const electronicSchema = new Schema({
    manufactory: {
        type: String,
        required: true
    },
    model: {
        type: String,
    },
    color: {
        type: String
    },
}, {
    collection: 'electronics',
    timestamps: true
})

const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String,
    },
    material: {
        type: String
    },
}, {
    collection: 'furnitures',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronic', electronicSchema),
    furniture: model('Furniture', furnitureSchema),
}
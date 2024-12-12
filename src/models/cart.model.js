'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
    state: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'failed', 'pending']
    },
    products: {
        type: Array, 
        default: [],
        required: true,
    }, 
    
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, cartSchema)
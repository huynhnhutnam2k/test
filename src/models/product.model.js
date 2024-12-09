'use strict'

const { Schema, model } = require('mongoose')
const { default: slugify } = require('slugify')
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
    },

    slug: {
        type: String
    },

    avgRating: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must above 1.0'],
        max: [5, 'Rating must below 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },

    variations: {
        type: Array,
        default: []
    },

    isDraft: {
        type: Boolean,
        default: true
    },

    isPublished: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

productSchema.index(['name description', 'text'])

productSchema.pre('save', (next) => {
    this.slug = slugify(this.name, { lower: true })
    next()
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
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
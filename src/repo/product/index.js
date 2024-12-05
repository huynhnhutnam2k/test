'use strict'

const { Schema } = require('mongoose')
const { product } = require("../../models/product.model")
const { BadRequestError } = require('../../core/error.response')

const getProductById = async (id, condition = {}) => {
    return await product.findOne({
        _id: Schema.Types.ObjectId(id),
        ...condition
    })
}

const getProductsPublished = async ({ query, limit, skip }) => {
    return await product.find(query).populate('shop', 'name _id').sort({ updateAt: -1 }).skip(skip).limit(limit).lean().exec()
}

const getProductsDraft = async ({ query, limit, skip }) => {
    return await product.find(query).populate('shop', 'name _id').sort({ updateAt: -1 }).skip(skip).limit(limit).lean().exec()
}

const publishProduct = async ({
    shop,
    id
}) => {
    const foundProduct = await getProductById(id, {
        shop: Schema.Types.ObjectId(shop)
    })

    if (!foundProduct) {
        throw new BadRequestError('Cant find product')
    }

    foundProduct.isPublished = true
    foundProduct.isDraft = false

    const { modifiedCount } = await product.update(foundProduct)
    return modifiedCount
}

const draftProduct = async ({
    shop,
    id
}) => {
    const foundProduct = await getProductById(id, {
        shop: Schema.Types.ObjectId(shop)
    })

    if (!foundProduct) {
        throw new BadRequestError('Cant find product')
    }

    foundProduct.isPublished = false
    foundProduct.isDraft = true

    const { modifiedCount } = await product.update(foundProduct)
    return modifiedCount
}

const getAllProducts = async ({ query, limit, skip }) => {
    return await product.find(query).limit(limit).skip(skip).select()
}

const searchProductsByKeyword = async (keyword) => {
    const regex = new RegExp(keyword)

    const products = await product.find({
        isPublished: true,
        $text: {
            $search: regex
        }
    }, {
        score: {
            $meta: 'textScore'
        }
    }).sort({ updateAt: -1 }).lean()

    return products
}

module.exports = {
    getProductById,
    getProductsPublished,
    getProductsDraft,
    publishProduct,
    draftProduct,
    getAllProducts,
    searchProductsByKeyword
}
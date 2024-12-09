'use strict'

const { Schema } = require('mongoose')
const { product } = require("../models/product.model")
const { BadRequestError } = require('../core/error.response')
const { getSelectData, getUnselectData } = require('../utils')

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

const getOneProduct = async (id, unselect) => {
    return await product.findOne({
        _id: Schema.ObjectId(id),
        isPublished: true
    }).select(getUnselectData(unselect)).lean()
}

const getAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean()

    return products
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

const updateProductById = async ({
    product_id,
    dataUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(product_id, dataUpdate, {
        new: isNew
    })
}

module.exports = {
    getProductById,
    getProductsPublished,
    getProductsDraft,
    publishProduct,
    draftProduct,
    getAllProducts,
    getOneProduct,
    searchProductsByKeyword, 
    updateProductById
}
'use strict'
const { cart } = require('../models/cart.model')
const { convertToObjectIdMongodb } = require('../utils')

const findCartById = async (id) => {
    return await cart.findOne({
        _id: convertToObjectIdMongodb(id),
        state: 'active'
    }).lean()
}

module.exports = {
    findCartById
}
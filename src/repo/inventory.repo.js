'use strict'

const { inventory } = require("../models/inventory.model")
const { convertToObjectIdMongodb } = require("../utils")


const insertInventory = async ({
    productId,
    shopId,
    stock,
    location = 'unknown'
}) => {
    return await inventory.create({
        productId,
        shopId,
        stock,
        location
    })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        productId: convertToObjectIdMongodb(productId),
        stock: { $gte: quantity },
    }
    const updateSet = {
        $inc: {
            stock: -quantity,
        },
        $push: {
            reservation: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }

    const options = {
        upsert: true,
        new: true
    }

    return await inventory.findOneAndUpdate(query, updateSet, options)
}

module.exports = {
    insertInventory, 
    reservationInventory
}
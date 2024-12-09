'use strict'

const { inventory } = require("../models/inventory.model")


const insertInventory = async({
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

module.exports = {
    insertInventory
}
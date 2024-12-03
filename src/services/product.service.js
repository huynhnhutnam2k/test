'use strict'

const { product, clothing, electronic, furniture } = require("../models/product.model")
const { BadRequestError, ForbiddenError } = require('../core/error.response')

class ProductFactory {
    /**
     * type: clothing | electronic | ...
     * payload
     */


    static async createProduct(type, payload) {
        switch (type) {
            case 'Electronics':
                return new Electronic(payload)
            case 'Clothing':
                return new Clothing(payload)
            default:
                throw new BadRequestError('Invalid product type ')
        }
    }
}

//#region Define product class
class Product {
    constructor({
        name,
        thumb,
        description,
        price,
        quantity,
        type,
        shop,
        attributes,
    }) {
        this.name = name
        this.thumb = thumb
        this.description = description
        this.price = price
        this.quantity = quantity
        this.type = type
        this.shop = shop
        this.attributes = attributes
    }

    // create new product

    async createProduct() {
        return await product.create(this)
    }
}
//#endregion

//#region sub-class for difference product type
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.attributes)
        if (!newClothing) throw new BadRequestError('create new clothing error')

        const newProduct = await super.createProduct()
        if (!newProduct) {
            throw new BadRequestError('create new product error')
        }

        return newProduct
    }
}
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create(this.attributes)
        if (!newElectronic) throw new BadRequestError('create new clothing error')

        const newProduct = await super.createProduct()
        if (!newProduct) {
            throw new BadRequestError('create new product error')
        }

        return newProduct
    }
}

//#endregion

module.exports = ProductFactory
'use strict'

const { product, clothing, electronic } = require("../models/product.model")
const { BadRequestError } = require('../core/error.response')
const { searchProductsByKeyword, getProductsDraft, getOneProduct, getProductsPublished, publishProduct, draftProduct, getAllProducts, updateProductById } = require("../repo/product.repo")
const { removeFalselyObject, updateNestedObjectParser } = require("../utils")

class ProductFactory {
    /**
     * type: clothing | electronic | ...
     * payload
     */

    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }


    static async createProduct(type, payload) {
        // switch (type) {
        //     case 'Electronics':
        //         return new Electronic(payload)
        //     case 'Clothing':
        //         return new Clothing(payload)
        //     default:
        //         throw new BadRequestError('Invalid product type ')
        // }
        console.log(type)
        const productClass = this.productRegistry[type]
        if (!productClass) throw new BadRequestError('Type invalid')
        return new productClass(payload)
    }

    static async updateProduct(type, product_id, payload) {
        const productClass = this.productRegistry[type]
        if (!productClass) throw new BadRequestError('Type iss invalid')
        return new productClass(payload).updateProduct(product_id)
    }

    static async searchProduct(keyword) {
        return await searchProductsByKeyword(keyword)
    }

    static async getProductsDraft(shop, params) {
        const otherParams = Object.assign({
            limit: 50,
            skip: 0
        }, params)

        const query = {
            shop,
            isDraft: true
        }

        return getProductsDraft({
            query,
            ...otherParams
        })
    }

    static async getAllProduct({
        limit = 50,
        sort = 'ctime',
        page = 1,
        filter = { isPublished: true }
    }) {
        return getAllProducts({
            limit,
            sort,
            page,
            filter,
            select: ['name', 'price']
        })
    }

    static async getOne(id) {
        return await getOneProduct(id)
    }

    static async getProductsPublished(shop, params) {
        const otherParams = Object.assign({
            limit: 50,
            skip: 0
        }, params)
        const query = {
            shop,
            isPublished: true
        }
        return await getProductsPublished({
            query,
            ...otherParams
        })
    }

    static async publishedProduct(shop, id) {
        return await publishProduct({ shop, id })
    }

    static async unPublishedProduct() {
        return await draftProduct({ shop, id })
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

    async createProduct(product_id) {
        const newProduct = await product.create({ ...this, _id: product_id })
        if (newProduct) {
            await insertInventory({
                productId: product_id,
                shopId: this.shop,
                stock: this.quantity,
            })
        }

        return newProduct
    }

    async updateProduct(product_id, dataUpdate) {
        return await updateProductById({
            product_id,
            dataUpdate,
            model: product,
            isNew: true
        })
    }
}
//#endregion

//#region sub-class for difference product type
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({ ...this.attributes, shop: this.shop })
        if (!newClothing) throw new BadRequestError('create new clothing error')
        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) {
            throw new BadRequestError('create new product error')
        }

        return newProduct
    }

    async updateProduct(product_id) {
        /**
         * {
         * a: undefined
         * b: null
         * }
         */

        // 1: Remove attr has null or undefined
        const objParams = removeFalselyObject(this)
        // 2: Check xem update o dau
        if (objParams.attributes) {
            // update child
            await updateProductById({
                product_id,
                dataUpdate: updateNestedObjectParser(objParams.attributes),
                isNew: true,
                model: clothing
            })
        }

        const updateProduct = await super.updateProduct(product_id, objParams)

        return updateProduct
    }
}
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({ ...this.attributes, shop: this.shop })
        if (!newElectronic) throw new BadRequestError('create new clothing error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) {
            throw new BadRequestError('create new product error')
        }

        return newProduct
    }
}

//#endregion


ProductFactory.registerProductType('Electronics', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
module.exports = ProductFactory
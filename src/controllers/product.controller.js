'use strict'
const { CREATED }  = require('../core/success.response')
const ProductService = require('../services/product.service')

class ProductController {
    createProduct = async(req,res,next) => {
        new CREATED({
            message: 'Create success', 
            metadata: await ProductService.createProduct(req.body.type, req.body)
        }).send(res)
    }
}

module.exports = new ProductController()
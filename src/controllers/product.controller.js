'use strict'
const { CREATED } = require('../core/success.response')
const ProductService = require('../services/product.service')

class ProductController {
    createProduct = async (req, res, next) => {
        new CREATED({
            message: 'Create success',
            metadata: await ProductService.createProduct(req.body.type, req.body)
        }).send(res)
    }

    getAll = async (req, res, next) => { }

    getOne = async (req, res, next) => { }

    getDraft = async (req, res, next) => { }

    getPublished = async (req, res, next) => { }

    published = async (req, res, next) => { }

    unPublished = async (req, res, next) => { }

    search = async (req, res, next) => { }

}

module.exports = new ProductController()
'use strict'
const { CREATED, SuccessResponse } = require('../core/success.response')
const ProductService = require('../services/product.service')

class ProductController {
    createProduct = async (req, res, next) => {
        new CREATED({
            message: 'Create success',
            metadata: await ProductService.createProduct(req.body.type, { ...req.body, shop: req.user.userId })
        }).send(res)
    }

    updateProduct = async(req,res,next) => {
        new SuccessResponse({
            message: 'Update product', 
            metadata: await ProductService.updateProduct(req.body.type, req.params.id, {
                ...req.body, 
                shop: req.user.userId
            })
        })
    }

    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Products response',
            metadata: await ProductService.getAllProduct(req.query)
        }).send(res)
    }

    getOne = async (req, res, next) => {
        new SuccessResponse({
            message: `Product detail ${req.params.id}`,
            metadata: await ProductService.getOne(req.params.id)
        }).send(res)
    }

    getDraft = async (req, res, next) => {
        new SuccessResponse({
            message: 'Product draft list',
            metadata: await ProductService.getProductsDraft(req.user.userId, req.params)
        }).send(res)
    }

    getPublished = async (req, res, next) => {
        new SuccessResponse({
            message: 'Products published',
            metadata: await ProductService.getProductsPublished(req.user.userId, req.params)
        }).send(res)
    }

    published = async (req, res, next) => {
        new SuccessResponse({
            message: 'Published product successfully',
            metadata: await ProductService.publishedProduct(req.user.userId, req.params.id),
        }).send(res)
    }

    unPublished = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unpublished product successfully',
            metadata: await ProductService.unPublishedProduct(req.user.userId, req.params.id),
        }).send(res)
    }

    search = async (req, res, next) => {
        new SuccessResponse({
            metadata: await ProductService.searchProduct(req.params.keyword)
        }).send(res)
    }

}

module.exports = new ProductController()
'use strict'

const { NotFoundError, BadRequestError } = require("../core/error.response")
const { findCartById } = require("../repo/cart.repo")
const { checkProductByServer } = require("../repo/product.repo")
const { getDiscountAmount } = require("./discount.service")

class CheckoutService {
    // {
    //     cartId, 
    //     userId, 
    //     shop_order_ids: [
    //         {
    //             shopId, 
    //             shopDiscounts: [
    //                 {
    //                     shopId, 
    //                     discountId, 
    //                     codeId
    //                 }
    //             ],
    //             products: [
    //                 {
    //                     price,
    //                     quantity, 
    //                     productId
    //                 }
    //             ]
    //         }
    //     ]
    // }
    static async checkoutReview({ cartId, userId, shop_order_ids }) {
        const foundCart = await findCartById(cartId)

        if (!foundCart) throw new NotFoundError('Not found cart')

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }

        const new_shop_order_ids = []

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shopDiscounts, products } = shop_order_ids[i]

            const checkProductServer = await checkProductByServer(products)
            if (!checkProductByServer[0]) throw new BadRequestError('Order wrong')

            const checkoutPrice = checkProductByServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shopDiscounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                products: checkoutPrice
            }

            if (shopDiscounts.length > 0) {
                const { totalPrice, discount } = await getDiscountAmount({
                    codeId: shopDiscounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                checkout_order.totalDiscount += discount

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            new_shop_order_ids.push(itemCheckout)
        }

        return {
            shop_order_ids,
            new_shop_order_ids,
            checkout_order
        }
    }

    static async orderByUser({ shop_order_ids, cartId, userId, address, payment }) {
        const { checkout_order, new_shop_order_ids } = await CheckoutService.checkoutReview({ shop_order_ids, userId, cartId })

        // check inventory

        const products = new_shop_order_ids.flatMap(order => order.products)

        // pessimistic locks: Khóa bi quan
        // optimistic locks: Khóa lạc quan

        for (let i = 0; i < products.length; i++) {
            const { quantity, productId } = products[i]
        }
    }
}

module.exports = CheckoutService
'use strict'

const redis = require('redis')
const { promisify } = require('util')
const redisClient = redis.createClient()

const pExpire = promisify(redisClient.pExpire).bind(redisClient)
const setNXAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async ({ productId, quantity, cartId }) => {
    const key = `lock_v2024_${productId}`
    const retryTimes = 10
    const expireTime = 3_000

    for (let i = 0; i < retryTimes; i++){
        // create key:  who can pay
        const result = await setNXAsync(key, expireTime)

        console.log(result)

        // if ()
    }
}
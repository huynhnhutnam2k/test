"use strict";

const jwt = require("jsonwebtoken");
const { HEADER } = require("../constants/common");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "2 days",
        });

        const refreshToken = await jwt.sign(payload, process.env.SECRET_KEY, {
            // algorithm: "RS256",
            expiresIn: "7 days",
        });

        jwt.verify(accessToken, process.env.SECRET_KEY, (err, decode) => {
            if (err) {
                console.log("Error verify", err);
            }
        });
        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        console.log(error);
    }
};

const authentication = asyncHandler(async (req, res, next) => {
    /**
     * 1. Check user id missing
     * 2. get access token
     * 3. verify token
     * 4. check user in database
     * 5. check key store with this user id
     * 6. success all -> return next()
     */

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid request");

    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Not found keyStore");

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("Invalid request");
    try {
        const token = accessToken.split(" ")[1];
        const decodeUser = jwt.verify(token, process.env.SECRET_KEY);
        if (userId !== decodeUser?.userId) {
            throw new AuthFailureError("Invalid userID");
        }

        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    } catch (error) {
        throw error;
    }
});

module.exports = {
    createTokenPair,
    authentication,
};

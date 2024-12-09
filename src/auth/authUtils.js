"use strict";

const jwt = require("jsonwebtoken");
const { HEADER } = require("../constants/common");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("Error verify");
      }

      console.log({ decode });
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) { }
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

  const userId = req.headers[HEADER.CLIENT_ID]

  if (!userId) throw new AuthFailureError('Invalid request')

  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) throw new NotFoundError('Not found keyStore')

  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Invalid request')

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey)

    if (userId !== decodeUser.userId) {
      throw new AuthFailureError('Invalid userID')
    }

    req.keyStore = keyStore
    req.user = decodeUser
    return next()
  } catch (error) {
    throw error
  }

})

module.exports = {
  createTokenPair,
  authentication
};

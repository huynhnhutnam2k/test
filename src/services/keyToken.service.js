"use strict";
const keyTokenModel = require("../models/keyToken.model");
const { Types } = require('mongoose')

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });

      return tokens ? tokens.publicKey : null;
    } catch (error) { }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: Types.ObjectId(userId) }).lean()
  }

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: Types.ObjectId(id) })
  }
}


module.exports = KeyTokenService;

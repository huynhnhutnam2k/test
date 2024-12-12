"use strict";
const { Types } = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");
const { Schema } = require('mongoose')

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // const publicKeyString = publicKey.toString();
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString,
      // });

      // return tokens ? tokens.publicKey : null;

      const filter = { user: userId }, update = {
        publicKey, privateKey, refreshTokensUsed: [], refreshToken
      }, option = {
        upsert: true,
        new: true
      }

      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, option)
      return tokens ? tokens?.publicKey : null
    } catch (error) { }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
  }

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: Types.ObjectId(id) })
  }
}


module.exports = KeyTokenService;

"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const {
  ConflictRequestError,
  BadRequestError,
} = require("../core/error.response");
const userModel = require("../models/user.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getData } = require("../utils");

class AccessService {
  //#region handle keys
  static generateKeys = async () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    return {
      privateKey,
      publicKey,
    };
  };

  //#endregion
  static signUp = async (body) => {
    const { email, password, name } = body;

    const list = await userModel.find();
    console.log(list);
    const holder = await userModel.findOne({ email }).lean();

    if (holder) {
      throw new ConflictRequestError(`Error: Account already registered!!`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = await userModel.create(payload);

    if (!newUser) {
      throw new BadRequestError("Create new user error");
    }

    const { privateKey, publicKey } = this.generateKeys();

    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: newUser._id,
      publicKey,
    });

    if (!publicKeyString) {
      throw new BadRequestError("publicKeyString error");
    }

    const tokens = await createTokenPair(
      {
        id: newUser._id,
        email: newUser.email,
      },
      publicKeyString,
      privateKey
    );

    return {
      user: getData(newUser, ["_id", "name"]),
      tokens,
    };
  };

  static signIn = async (body) => {
    const { email, password } = body;
    const userExist = await userModel.findOne({ email }).lean();
    if (!userExist) throw new BadRequestError("User not exist");

    const hashPassword = await bcrypt.compare(userExist.password, password);

    if (!hashPassword) {
      throw new BadRequestError("Password not correct");
    }

    const { publicKey, privateKey } = this.generateKeys();

    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: userExist._id,
      publicKey: publicKey,
    });

    if (!publicKeyString) throw new BadRequestError("Public key is not exist");

    const tokens = await createTokenPair(
      {
        _id: userExist._id,
        email: userExist.email,
      },
      publicKeyString,
      privateKey
    );

    return {
      user: getData(userExist, ["_id", "email"]),
      tokens,
    };
  };

  static logout = async(keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    return delKey
  }
}

module.exports = AccessService;

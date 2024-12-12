"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const {
  ConflictRequestError,
  BadRequestError,
} = require("../core/error.response");
const { user } = require("../models/user.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getData } = require("../utils");

class AccessService {
  //#region handle keys
  static generateKeys = () => {
    // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    //   modulusLength: 4096,
    //   publicKeyEncoding: {
    //     type: "pkcs1",
    //     format: "pem",
    //   },
    //   privateKeyEncoding: {
    //     type: "pkcs1",
    //     format: "pem",
    //   },
    // });
    const privateKey = crypto.randomBytes(64).toString("hex")
    const publicKey = crypto.randomBytes(64).toString("hex")

    return {
      privateKey,
      publicKey,
    };
  };

  //#endregion
  static signUp = async (body) => {
    const { email, password, name } = body;

    const holder = await user.findOne({ email }).lean();

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

    const newUser = await user.create(payload);

    if (!newUser) {
      throw new BadRequestError("Create new user error");
    }

    const { privateKey, publicKey } = this.generateKeys();

    const tokens = await createTokenPair(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      publicKey,
      privateKey,
    );

    await KeyTokenService.createKeyToken({
      userId: newUser._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    });

    return {
      user: getData(newUser, ["_id", "name"]),
      tokens,
    };
  };

  static signIn = async (body) => {
    const { email, password } = body;
    const userExist = await user.findOne({ email }).lean();
    if (!userExist) throw new BadRequestError("User not exist");
    const hashPassword = await bcrypt.compare(password, userExist.password);

    if (!hashPassword) {
      throw new BadRequestError("Password not correct");
    }

    const { publicKey, privateKey } = this.generateKeys();


    const tokens = await createTokenPair(
      {
        userId: userExist._id,
        email: userExist.email,
      },
      publicKey,
      privateKey
    );

    // publicKeyString
    await KeyTokenService.createKeyToken({
      userId: userExist._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    });

    // if (!publicKeyString) throw new BadRequestError("Public key is not exist");


    return {
      user: getData(userExist, ["_id", "email"]),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    return delKey
  }
}

module.exports = AccessService;

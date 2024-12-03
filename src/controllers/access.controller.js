"use strict";

const { SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res) => {
    new SuccessResponse({
      message: "Signup success",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
  signIn = async (req, res) => {
    new SuccessResponse({
      message: "Signin success",
      metadata: await AccessService.signIn(req.body),
    }).send(res);
  };
  logout = async (req, res) => {
    new SuccessResponse({
      message: "Logout success",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
}

module.exports = new AccessController();

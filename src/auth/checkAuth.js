"use strict";

const { HEADER } = require("../constants/common");
const { ForbiddenError } = require("../core/error.response");
const { findApiKeyByKey } = require("../services/apiKey.service");

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) throw new ForbiddenError("Forbidden");

    const objKey = await findApiKeyByKey(key);
    if (!objKey) throw new ForbiddenError("Forbidden");

    req.objKey = objKey;

    return next();
  } catch (error) { }
};

const checkPermissions = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions)
      throw new ForbiddenError("objKey permission not found");
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) throw new ForbiddenError("You have not permission");

    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  checkPermissions,
  asyncHandler,
};

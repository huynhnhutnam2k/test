"use strict";

const express = require("express");
const { apiKey, checkPermissions } = require("../auth/checkAuth");

const router = express.Router();

router.use(apiKey);

router.use(checkPermissions("0000"));

router.use('/v1/products', require('./product'))
router.use("/v1", require("./access"));

module.exports = router;

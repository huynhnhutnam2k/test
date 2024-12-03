"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();


router.post("/signup", accessController.signUp);
router.post("/signin", accessController.signIn);

router.use(authentication)
router.post('/logout', accessController.logout)
module.exports = router;

const express = require("express");
const router = express.Router();

const { registerBusiness } = require("../controllers/business.controller");

router.post("/registerbusiness", registerBusiness);

module.exports = router;

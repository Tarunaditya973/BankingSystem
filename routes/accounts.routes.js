const express = require("express");
const router = express.Router();

const {
  createAccount,
  deposit,
  getBalance,
  withdraw,
} = require("../controllers/accounts.controller");

router.post("/createaccount", createAccount);
router.post("/deposit", deposit);
router.get("/getbalance", getBalance);
router.post("/withdraw", withdraw);

module.exports = router;

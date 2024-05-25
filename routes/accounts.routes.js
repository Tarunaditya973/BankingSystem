const express = require("express");
const router = express.Router();

const {
  createAccount,
  deposit,
  getBalance,
  withdraw,
  transfer,
} = require("../controllers/accounts.controller");

router.post("/createaccount", createAccount);
router.post("/deposit", deposit);
router.get("/getbalance", getBalance);
router.post("/withdraw", withdraw);
router.post("/transfer", transfer);

module.exports = router;

const Account = require("../models/accountModel");
const Business = require("../models/businessModel");

const Account = require("../models/accountModel");
const Business = require("../models/businessModel");

exports.createAccount = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { account_number, ifsc_code, daily_withdrawal_limit } = req.body;

    // Check if the account number already exists
    const existingAccount = await Account.findOne({ account_number });
    if (existingAccount) {
      return res.status(400).json({ error: "Account number already exists" });
    }

    const account = new Account({
      business_id: businessId,
      account_number,
      ifsc_code,
      daily_withdrawal_limit,
    });

    await account.save();

    // Update the business with the new account reference
    await Business.findByIdAndUpdate(businessId, {
      $push: { accounts: account._id },
    });

    res.status(201).json({
      message: "Account created successfully",
      accountId: account._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deposit = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { amount } = req.body;

    const account = await Account.findById(accountId);

    if (!account.allowCredit) {
      return res.status(403).json({
        message: "Credit transactions are not allowed for this account",
      });
    }

    account.balance += amount;
    account.transactions.push({ type: "deposit", amount });

    await account.save();
    res.status(200).json({
      message: "Deposit transaction successful",
      transactionId: account.transactions[account.transactions.length - 1]._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.withdraw = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { amount } = req.body;

    const account = await Account.findById(accountId);

    if (!account.allowDebit) {
      return res.status(403).json({
        message: "Debit transactions are not allowed for this account",
      });
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const withdrawalsToday = account.transactions
      .filter(
        (tx) =>
          tx.type === "withdrawal" &&
          new Date(tx.date).setHours(0, 0, 0, 0) === today
      )
      .reduce((acc, tx) => acc + tx.amount, 0);

    if (withdrawalsToday + amount > account.daily_withdrawal_limit) {
      return res
        .status(403)
        .json({ message: "Daily withdrawal limit exceeded" });
    }

    if (amount > account.balance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    account.balance -= amount;
    account.transactions.push({ type: "withdrawal", amount });

    await account.save();
    res.status(200).json({
      message: "Withdrawal transaction successful",
      transactionId: account.transactions[account.transactions.length - 1]._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await Account.findById(accountId);
    res.status(200).json({ balance: account.balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

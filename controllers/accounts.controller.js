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

const Account = require("../models/accountModel");

exports.transfer = async (req, res) => {
  try {
    const { senderAccountId, receiverAccountNumber, receiverIfscCode, amount } =
      req.body;

    // Find the sender's account
    const senderAccount = await Account.findById(senderAccountId);
    if (!senderAccount) {
      return res.status(404).json({ error: "Sender account not found" });
    }

    // Find the receiver's account
    const receiverAccount = await Account.findOne({
      account_number: receiverAccountNumber,
      ifsc_code: receiverIfscCode,
    });
    if (!receiverAccount) {
      return res.status(404).json({ error: "Receiver account not found" });
    }

    // Check if the sender has sufficient balance
    if (senderAccount.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Update sender's balance
    senderAccount.balance -= amount;
    senderAccount.transactions.push({ type: "debit", amount });
    await senderAccount.save();

    // Update receiver's balance
    receiverAccount.balance += amount;
    receiverAccount.transactions.push({ type: "credit", amount });
    await receiverAccount.save();

    res.status(200).json({ message: "Transfer successful" });
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

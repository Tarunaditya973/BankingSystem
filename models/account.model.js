const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    account_number: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{1,10}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid account number! Account number must be up to 10 digits.`,
      },
    },
    ifsc_code: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{1,8}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid IFSC code! IFSC code must be up to 8 digits.`,
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    allowCredit: {
      type: Boolean,
      default: true,
    },
    allowDebit: {
      type: Boolean,
      default: true,
    },
    daily_withdrawal_limit: {
      type: Number,
      required: true,
      min: 0,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;

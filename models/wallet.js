import mongoose from "mongoose";
const Schema = mongoose.Schema;

let wallet = new Schema({
  userId: String,
  isAdmin: Boolean,
  step: Number,
  verification: Boolean,
  ssn: String,
  cryptoAddress: String,
  privateWallet: [{ privateKey: String, address: String }],
  bankinfo: [
    {
      email: String,
    },
  ],
  number: String,
});

const Wallet = mongoose.model("wallet", wallet);

module.exports = Wallet;

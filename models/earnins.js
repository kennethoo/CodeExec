import mongoose from "mongoose";
const Schema = mongoose.Schema;

let earnings = new Schema({
  userId: String,
  customerId: String,
  earnings: Number,
  takeCut: Number,
  programId: String,
  date: String,
});

const Earnings = mongoose.model("Earning", earnings);

module.exports = Earnings;

import mongoose from "mongoose";
const Schema = mongoose.Schema;

let myearn = new Schema({
  paymentReveiverId: String,
  programId: String,
  customerId: String,
  pay: Number,
  moneyToGet: Number,
  date: String,
});

const MyEarnings = mongoose.model("myearn", myearn);

module.exports = MyEarnings;

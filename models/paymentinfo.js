import mongoose from "mongoose";
const Schema = mongoose.Schema;

let paymentinfo = new Schema({
  userId: String,
  earnings: Number,
  unpaidBalance: Number,
});

const PaymentInfo = mongoose.model("paymentinfo", paymentinfo);
module.exports = PaymentInfo;

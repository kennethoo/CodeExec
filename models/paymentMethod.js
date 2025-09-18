import mongoose from "mongoose";
let Schema = mongoose.Schema;

let paymentMethod = new Schema({
  userId: String,
  customerId: String,
  paymentTokens: [{ token: String, default: Boolean, ending: String }],
});

const PaymentMethod = mongoose.model("paymentmethod", paymentMethod);

module.exports = PaymentMethod;

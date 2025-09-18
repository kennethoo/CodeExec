import mongoose from "mongoose";
const Schema = mongoose.Schema;

let email = new Schema({
  email: String,
});
let Email = mongoose.model("email", email);

module.exports = Email;

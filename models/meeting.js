import mongoose from "mongoose";
const Schema = mongoose.Schema;
const meeting = new Schema({
  publisherId: String,
  isPaid: Boolean,
  price: Number,
  title: String,
  duration: Number,
  description: String,
  isActive: Boolean,
});
const Meeting = mongoose.model("meeting", meeting);
module.exports = Meeting;

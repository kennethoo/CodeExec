import mongoose from "mongoose";
const Schema = mongoose.Schema;

let interest = new Schema({
  accountId: {
    type: String,
  },
  tags: [{ type: String }],
});

const Interest = mongoose.model("interest", interest);
module.exports = Interest;

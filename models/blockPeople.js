import mongoose from "mongoose";
const Schema = mongoose.Schema;

const block = new Schema({
  userId: String,
  people: [{ type: String }],
});

const Block = mongoose.model("block", block);

module.exports = Block;

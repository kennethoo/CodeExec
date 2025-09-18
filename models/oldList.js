import mongoose from "mongoose";
const Schema = mongoose.Schema;

let oldList = new Schema({
  User: String,
  subScriberId: String,
});

let OldList = mongoose.model("oldList", oldList);

module.exports = OldList;

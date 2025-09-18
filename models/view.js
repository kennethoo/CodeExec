import mongoose from "mongoose";
const Schema = mongoose.Schema;

let view = new Schema({
  userId: String,
  mediaId: String,
});

let View = mongoose.model("view", view);
module.exports = View;

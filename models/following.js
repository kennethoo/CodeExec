import mongoose from "mongoose";
const Schema = mongoose.Schema;

let following = new Schema({
  userId: String,
  followingId: String,
});

let Following = mongoose.model("following", following);
module.exports = Following;

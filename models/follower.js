import mongoose from "mongoose";
const Schema = mongoose.Schema;

let follower = new Schema({
  userId: String,
  followerId: String,
});

const Follower = mongoose.model("follower", follower);
module.exports = Follower;

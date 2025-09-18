import mongoose from "mongoose";
const Schema = mongoose.Schema;

let likeprogram = new Schema({
  userId: String,
  programId: String,
  like: Boolean,
});

let LikeProgram = mongoose.model("likedprogram", likeprogram);
module.exports = LikeProgram;

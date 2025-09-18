import mongoose from "mongoose";
let Schema = mongoose.Schema;

let likepost = new Schema({
  userId: String,
  postId: String,
});

let LikedPost = mongoose.model("likedpost", likepost);
module.exports = LikedPost;

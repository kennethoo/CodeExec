import mongoose from "mongoose";
const Schema = mongoose.Schema;

let comment = new Schema(
  {
    userId: String,
    postId: String,
    content: String,
    date: String,
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", comment);
module.exports = Comment;

import mongoose from "mongoose";
const Schema = mongoose.Schema;
let commentMedia = new Schema({
  userId: String,
  mediaId: String,
  content: String,
  numberoflike: String,
  reply: [
    {
      userId: String,
      content: String,
      numberoflike: String,
    },
  ],
});

const CommentMedia = mongoose.model("commentMedia", commentMedia);
module.exports = CommentMedia;

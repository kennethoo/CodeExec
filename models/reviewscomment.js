import mongoose from "mongoose";
const Schema = mongoose.Schema;

let programComment = new Schema({
  username: String,
  profileUrl: String,
  posterId: String,
  publisherId: String,
  reply: Number,
  content: String,
});

let ProgramComment = mongoose.model("comment", programComment);
module.exports = ProgramComment;

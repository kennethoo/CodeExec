import mongoose from "mongoose";
const Schema = mongoose.Schema;

let medialike = new Schema({
  mediaId: String,
  like: [{ type: String }],

  dislike: [{ type: String }],
});

const Medialike = mongoose.model("notificationbasic", medialike);
module.exports = Medialike;

import mongoose from "mongoose";
const Schema = mongoose.Schema;

let buble = new Schema({
  broadcasterId: String,
  broadcasterName: String,
  roomId: String,
  roomName: String,
  roomInfo: String,
  instant: Boolean,
  scheduleBox: String,
});

let Buble = mongoose.model("buble", buble);

module.exports = Buble;

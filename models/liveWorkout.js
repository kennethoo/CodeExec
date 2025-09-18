import mongoose from "mongoose";
const Schema = mongoose.Schema;

let liveWo = new Schema({
  userId: String,
  account: [{ broadcasterId: String, roomId: String }],
});

let MyLive = mongoose.model("live", liveWo);
module.exports = MyLive;

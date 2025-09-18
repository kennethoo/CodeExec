import mongoose from "mongoose";
const Schema = mongoose.Schema;
const scheduler = new Schema({
  publisherId: String,
  participantId: String,
  publisherEmail: String,
  participantEmail: String,
  startTime: String,
  meetingSessionId: String,
});
const Scheduler = mongoose.model("scheduler", scheduler);
module.exports = Scheduler;

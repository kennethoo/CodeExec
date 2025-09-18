import mongoose from "mongoose";
const Schema = mongoose.Schema;

const programInfo = new Schema({
  mediaInfo: {
    mediaUrl: String,
    mediaType: String,
  },
  programId: String,
  publisherId: String,
  title: String,
  description: String,
});

const ProgramInfo = mongoose.model("ProgramInfo", programInfo);

module.exports = ProgramInfo;

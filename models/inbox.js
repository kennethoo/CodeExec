import mongoose from "mongoose";
const Schema = mongoose.Schema;

let inbox = new Schema({
  userId: String,
  data: [
    {
      userId: { type: String },
      name: { type: String },
      data: { type: String },
      kind: { type: String },
      profileGroup: { type: String },
      members: [{ userId: { type: String } }],
      conversationId: { type: String },
    },
  ],
});

let Inbox = mongoose.model("indox", inbox);
module.exports = Inbox;

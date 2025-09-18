import mongoose from "mongoose";
const Schema = mongoose.Schema;

let conversation = new Schema({
  conversationId: String,
  date: String,
  message: [
    {
      sender: String,
      content: String,
      kind: String,
    },
  ],
});

let Conversation = mongoose.model("conversation", conversation);
module.exports = Conversation;

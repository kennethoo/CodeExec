import mongoose from "mongoose";

const Schema = mongoose.Schema;
const sessionModal = new Schema({
  _id: String,
  expires: Date,
  session: Object,
});

const Session = mongoose.model("session", sessionModal);
export default Session;

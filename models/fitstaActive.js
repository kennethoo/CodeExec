import mongoose from "mongoose";
const Schema = mongoose.Schema;

let activefitsta = new Schema({
  userId: String,
  activate: Boolean,
});

const Activefitsta = mongoose.model("activefitsta", activefitsta);

module.exports = Activefitsta;

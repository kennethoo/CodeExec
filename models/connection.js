import mongoose from "mongoose";
const Schema = mongoose.Schema;

let connection = new Schema({
  userId: String,
});

let Connection = mongoose.model("connection", connection);
module.exports = Connection;

import mongoose from "mongoose";
const Schema = mongoose.Schema;

let rating = new Schema({
  userId: String,
  programId: String,
  review: String,
  star: Number,
});

const Rating = mongoose.model("rating", rating);

module.exports = Rating;

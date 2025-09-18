import mongoose from "mongoose";
const Schema = mongoose.Schema;

let sellProgram = new Schema({
  file: String,
  programId: String,
  fileType: String,
  author: String,
  publisherId: String,
  title: String,
  description: String,
  numberofLike: Number,
  numberOfComments: Number,
  numberOfPeopleRating: Number,
  rating: Number,
  ratingSum: Number,
  published: Boolean,
  programType: String,
  price: Number,
});

const SellProgram = mongoose.model("program", sellProgram);
module.exports = SellProgram;

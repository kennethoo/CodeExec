import mongoose from "mongoose";
const Schema = mongoose.Schema;

const program = new Schema({
  previewProgram: {
    previewUrl: String,
    previewType: String,
  },
  programId: String,
  publisherId: String,
  title: String,
  description: String,
  numberOfPeopleRating: Number,
  rating: Number,
  ratingSum: Number,
  published: Boolean,
  programType: Number,
});

const Program = mongoose.model("program", program);

module.exports = Program;

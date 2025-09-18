import mongoose from "mongoose";
const Schema = mongoose.Schema;

let myorder = new Schema({
  userId: String,
  publisherId: String,
  item: [
    {
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
      programType: Number,
      price: Number,
    },
  ],
});

const Myorder = mongoose.model("card", myorder);

module.exports = Myorder;

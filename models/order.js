import mongoose from "mongoose";
const Schema = mongoose.Schema;

let order = new Schema({
  userId: String,
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

const Order = mongoose.model("card", order);

module.exports = Order;

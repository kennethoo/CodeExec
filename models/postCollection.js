import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postCollection = new Schema({
  userId: String,
  collectionName: String,
  collectionList: [
    {
      type: String,
    },
  ],
});

let PostCollection = mongoose.model("postCollection", postCollection);

module.exports = PostCollection;

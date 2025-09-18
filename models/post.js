import mongoose from "mongoose";
let Schema = mongoose.Schema;
let post = new Schema({
  userId: {
    type: String,
  },
  banned: {
    type: Boolean,
  },
  tags: [{ type: String }],
  numberOfLikes: {
    type: Number,
  },
  numberOfComments: {
    type: Number,
  },
  engagementScore: Number,
  mediaDetails: [
    {
      key: String,
      mimetype: String,
    },
  ],
  caption: {
    type: String,
  },
  date: {
    type: String,
  },
});

let Post = mongoose.model("post", post);
module.exports = Post;

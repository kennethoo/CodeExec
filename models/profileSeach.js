import mongoose from "mongoose";
let Schema = mongoose.Schema;
let profile = new Schema({
  userId: String,
  savedUserIds: [
    {
      userId: String,
    },
  ],
});

let ProfileSceach = mongoose.model("profileseach", profile);

module.exports = ProfileSceach;

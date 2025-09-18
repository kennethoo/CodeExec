import mongoose from "mongoose";
const Schema = mongoose.Schema;

let programBougth = new Schema({
  userId: {
    type: String,
  },
  data: [
    {
      programId: String,
      kind: Number,
      publisherId: String,
      date: String,
    },
  ],
});

const ProgramBougth = mongoose.model("programbougth", programBougth);
module.exports = ProgramBougth;

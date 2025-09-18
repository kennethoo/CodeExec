import mongoose from "mongoose";
const Schema = mongoose.Schema;

let myfitstapro = new Schema({
  userId: String,
  username: String,
  profileUrl: String,
  bio: String,
  banner: String,
  numberOfProgram: Number,
  numberOfSubscriber: Number,
  agree: Boolean,
  email: String,
  phoneNumber: String,
  plan: [
    {
      planName: String,
      price: Number,
      productId: String,
      priceId: String,
    },
  ],
  accountType: Number,
});

const MyfitstaPro = mongoose.model("myfitstapro", myfitstapro);

module.exports = MyfitstaPro;

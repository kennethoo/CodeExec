import mongoose from "mongoose";
const Schema = mongoose.Schema;

// design a muitople chatting systmet
// protocal to create a space
// create a space
// add a partianbt to space
// remove a partianbt to a space
// create  sections chanles when you create a state ,
//export the Api
//add testing

const userWallet = new Schema({
  userId: String,
  walletValue: Number,
});

const UserWallet = mongoose.model("userWallet", userWallet);
class UserWalletApi {
  constructor() {
    this.FIX_PRICE = 0.01;
  }
  // this is to created a space

  haveEnoughtMoney = async (userId) => {
    const walletInfo = await this.getUserWallet(userId);
    if (!walletInfo.isWalletValid) {
      return { succeeded: false, errorMessage: walletInfo.errorMessage };
    }
    const { wallet } = walletInfo;

    const canMakeRequest = wallet.walletValue > 0;

    if (!canMakeRequest) {
      return {
        succeeded: false,
        errorMessage: "no enout moeny ",
        canMakeRequest,
      };
    }
    return { succeeded: true, canMakeRequest };
  };

  getUserWallet = async (userId) => {
    const wallet = await UserWallet.findOne({ userId });
    if (wallet) {
      return { succeeded: true, wallet, isWalletValid: true };
    } else {
      return {
        succeeded: true,
        wallet,
        isWalletValid: false,
        errorMessage: "user does not have a wallet",
      };
    }
  };

  loadWallet = async ({ userId, value, paymentIntentId, paymentMethodeId }) => {
    //create a transation
    const { wallet, isWalletValid } = await this.getUserWallet(userId);

    if (!isWalletValid) {
      await UserWallet.create({ userId, walletValue: value });
      return { succeeded: true, data: value };
    }
    const newValue = wallet.walletValue + value;
    await UserWallet.findOneAndUpdate({ userId }, { walletValue: newValue });
    return { succeeded: true, data: newValue };
  };
  decrimentWallet = async (userId) => {
    const { wallet } = await this.getUserWallet(userId);
    const newValue = wallet.walletValue - this.FIX_PRICE;
    await UserWallet.findOneAndUpdate({ userId }, { walletValue: newValue });
    return { succeeded: true, data: newValue };
  };
}

const userWalletApi = new UserWalletApi();
export default userWalletApi;

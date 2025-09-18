import mongoose from "mongoose";
const Schema = mongoose.Schema;

const meettumTransaction = new Schema({
  userId: String,
  amountTransacted: Number,
  isAmountTransactedToMeettumUser: Boolean,
  paymentIntentId: String,
  receiverUserId: String,
});

const Transaction = mongoose.model("transaction", meettumTransaction);
class TransactionMannager {
  constructor() {}
  createTransaction = async (payload) => {
    try {
      const transaction = await Transaction.create(payload);
      return { succeeded: true };
    } catch (error) {}
    return { succeeded: false, errorMessage: error.message };
  };
}

export const transactionApi = new TransactionMannager();

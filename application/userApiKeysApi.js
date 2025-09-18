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

const userKey = new Schema({
  userId: String,
  apiKey: String,
});

const UserKeys = mongoose.model("apikey", userKey);
class UserApiKeysApi {
  constructor() {}
  // this is to created a space

  createKey = async (userId) => {
    const apiKey = await this.genenerateKey();
    const userKeys = await UserKeys.create({ userId, apiKey });
    return { succeeded: true, result: userKeys };
  };

  genenerateKey = async () => {
    return new Promise((resolve, reject) => {
      const result = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
      resolve(result);
    });
  };

  verifyKey = async (apiKey) => {
    const userKey = await UserKeys.findOne({ apiKey });
    if (userKey) {
      return {
        succeeded: true,
        isKeyValid: true,
        userKey: userKey._doc,
        errorMessage: "no a valid key",
      };
    } else {
      return { succeeded: true, isKeyValid: false };
    }
  };
  deleteKey = async ({ userId, apiKey }) => {
    const userKey = UserKeys.deleteOne({ userId, apiKey });
    if (userKey) {
      return { succeeded: true, isKeyDeleted: true };
    } else {
      return { succeeded: true, isKeyDeleted: false };
    }
  };

  getAllUserKey = async (userId) => {
    const userKeys = await UserKeys.find({ userId });
    return { succeeded: true, userKeys };
  };
}

const userApiKeysApi = new UserApiKeysApi();
export default userApiKeysApi;

import User from "../models/sighup.js";
import { UserProfile } from "../application/userProfile.js";

export class UserManager {
  constructor(userId) {
    this.userId = userId;
  }
  deleteAccount = async () => {
    const user = await User.findOne({ _id: this.userId });
    if (!user) {
      return { succeeded: false, errorMessage: "Somthing went wrong" };
    }
    await User.deleteOne({ _id: this.userId });
    await UserProfile.deleteOne({ userId: this.userId });

    return { succeeded: true, message: "So sad to see you go" };
  };

  getUser = async (query) => {
    try {
      const user = await UserProfile.findOne(query);
      if (user) {
        return { user, succeeded: true };
      } else {
        return { succeeded: false, errorMessage: "user does not exite" };
      }
    } catch (error) {
      return { errorMessage: error.message, succeeded: false };
    }
  };
  updateUserInfo = async (userProfile) => {
    const { userId } = userProfile;
    try {
      const user = await UserProfile.updateOne({ userId }, { ...userProfile });
      if (user) {
        return { user, succeeded: true };
      } else {
        return { succeeded: false, errorMessage: "user does not exite" };
      }
    } catch (error) {
      return { errorMessage: error.message, succeeded: false };
    }
  };

  upgrateUserToMeettumPro = async (userId) => {
    try {
      const { user } = await this.getUser({ userId });
      return this.updateUserInfo({ ...user._doc, isProUser: true });
    } catch (error) {
      return { errorMessage: error.message, succeeded: false };
    }
  };

  removeUserProMetttumPro = async (userId) => {
    try {
      const { user } = await this.getUser({ userId });
      return this.updateUserInfo({ ...user._doc, isProUser: false });
    } catch (error) {
      return { errorMessage: error.message, succeeded: false };
    }
  };

  internalGetUsers = async (query) => {
    try {
      const users = await UserProfile.find(query);
      if (users) {
        return { users, succeeded: true };
      } else {
        return { succeeded: false, errorMessage: "user does not exite" };
      }
    } catch (error) {
      return { errorMessage: error.message, succeeded: false };
    }
  };

  addSpaces = async (userId, space) => {
    const { user } = await this.getUser({ userId });
    user.connectedSpace.push(space);
    await user.save();
    return { succeeded: true };
  };
}
export const userManager = new UserManager(null);

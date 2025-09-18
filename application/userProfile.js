import mongoose from "mongoose";
const Schema = mongoose.Schema;

const profile = new Schema({
  userId: {
    type: String,
    require: true,
  },
  username: {
    type: String,
  },
  fullName: {
    type: String,
  },
  profile: {
    type: String,
  },

  blocked: {
    type: Boolean,
  },

  website: {
    type: String,
  },
  bio: {
    type: String,
  },
  timeZone: {
    type: String,
  },
  email: {
    type: String,
  },

  isAdmin: {
    type: Boolean,
  },
  isProUser: Boolean,
  description: {
    type: String,
  },
  connectedAccounts: [
    {
      accountType: String,
      token: String,
      refreshToken: String,
      id: String,
      expiresIn: Number,
    },
  ],

  connectedSpace: [{ spaceId: String, isOwner: Boolean, isDefault: Boolean }],
});

export const UserProfile = mongoose.model("userProfile", profile);

class UserProfileManager {
  constructor() {}

  searchUserProfileByUserIdOrUsername = async (query) => {
    const { username, userId } = query;
    if (!username && !userId) {
      return {
        succeeded: false,
        errorMessage: "please provide a userId or username ",
      };
    }
    if (username) {
      const user = await UserProfile.findOne({ username });
      if (user) {
        return {
          succeeded: true,
          username: user.username,
          timeZone: user.timeZone,
          email: user.email,
          isAdmin: user.isAdmin,
          profile: user.profile,
          bio: user.bio,
          fullName: user.fullName,
          userId: user.userId,
        };
      }
    }
    if (userId) {
      const user = await UserProfile.findOne({ userId });
      if (user) {
        return {
          userId: user.userId,
          succeeded: true,
          username: user.username,
          timeZone: user.timeZone,
          email: user.email,
          isAdmin: user.isAdmin,
          profile: user.profile,
          bio: user.bio,
          fullName: user.fullName,
        };
      }
    }
    return { succeeded: false, errorMessage: "user not found" };
  };
}

export const userProfileManager = new UserProfileManager();

const mongoose = require("mongoose");

const mongoose = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to blacklist"],
      unique: [true, "Token is already blacklisted"],
      index: true,
    },

   
  },
  {
    timestamps: true,
  },
);

/**
 * TTL Index
 * Token will be automatically deleted after 3 days
 * 60 sec * 60 min * 24 hr * 3 days
 */
tokenBlacklistSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 3  },
);

const tokenBlacklistModel = mongoose.model("TokenBlacklist", tokenBlacklistSchema);

module.exports = tokenBlacklistModel;

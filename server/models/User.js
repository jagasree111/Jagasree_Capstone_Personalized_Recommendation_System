const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  interests: {
    type: [String],
    default: [],
  },

  recommendations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recommendation",
    },
  ],

});

module.exports = mongoose.model("User", userSchema);
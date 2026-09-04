const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },

  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
});

module.exports = mongoose.model("Recommendation", recommendationSchema);
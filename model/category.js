const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  comics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comic",
    },
  ],
});

module.exports = mongoose.model("Category", categorySchema);

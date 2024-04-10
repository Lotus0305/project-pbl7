const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Author", authorSchema);

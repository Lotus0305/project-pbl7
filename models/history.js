const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.String,
    account: {
      type: mongoose.Schema.Types.String,
      ref: "Account",
      required: true,
    },
    novel: {
      type: mongoose.Schema.Types.String,
      ref: "Novel",
      required: true,
    },
    lastReadChapter: {
      type: Number,
      required: true,
    },
    lastReadDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
  { strict: true }
);

historySchema.pre("save", async function (next) {
  if (this.isNew) {
    if (!this._id) {
      const timestamp = Date.now().toString();
      const randomNum = Math.floor(Math.random() * 10000).toString();
      const id = timestamp + randomNum;
      this._id = "0" + id.toString();
    }
  }
  next();
});

module.exports = mongoose.model("History", historySchema);

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.String,
    content: {
      type: String,
      required: true,
    },
    novel: {
      type: mongoose.Schema.Types.String,
      ref: "Novel",
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.String,
      ref: "Account",
      required: true,
    },
    content: {
      type: String,
      required: true,
      min : 1,
    },
    rating: {
      type: mongoose.Schema.Types.Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
  { strict: true }
);

commentSchema.pre("save", async function (next) {
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

module.exports = mongoose.model("Comment", commentSchema);

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.Number,
    content: {
      type: String,
      required: true,
    },
    novel: {
      type: mongoose.Schema.Types.Number,
      ref: "Novel",
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.Number,
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
        const lastFind = await this.constructor.findOne().sort("-_id");
        const id = lastFind ? lastFind._id : 0;
        this._id = id + Date.now() + Math.floor(Math.random() * 10000);
      }
    }
    next();
  });

module.exports = mongoose.model("Comment", commentSchema);

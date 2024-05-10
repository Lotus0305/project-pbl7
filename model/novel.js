const mongoose = require("mongoose");

const novelSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.Number,
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    chapters: {
      type: String,
    },
    views: {
      type: String,
    },
    rating: {
      type: String,
    },
    powerStone: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.Number,
      ref: "Author",
    },
    category: {
      type: mongoose.Schema.Types.Number,
      ref: "Category",
    },
  },
  { timestamps: true },
  { strict: true }
);

novelSchema.pre("save", async function (next) {
  if (this.isNew) {
    if (!this._id) {
      const lastFind = await this.constructor.findOne().sort("-_id");
      const id = lastFind ? lastFind._id : 0;
      this._id = id + Date.now() + Math.floor(Math.random() * 10000);
    }
  }
  next();
});

module.exports = mongoose.model("Novel", novelSchema);
